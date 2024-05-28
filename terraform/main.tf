#region Network
# VPC
resource "aws_vpc" "vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true

  tags = { Name = "${var.naming_prefix}-vpc" }
}

# Internet Gateway
resource "aws_internet_gateway" "ig" {
  vpc_id = aws_vpc.vpc.id

  tags = { Name = "${var.naming_prefix}-ig" }
}

# Public Subnets
resource "aws_subnet" "public_subnets" {
  count                   = length(var.vpc_public_subnets)
  cidr_block              = var.vpc_public_subnets[count.index]
  vpc_id                  = aws_vpc.vpc.id
  map_public_ip_on_launch = true
  availability_zone       = var.vpc_azs[count.index % length(var.vpc_azs)]

  tags = { Name = "${var.naming_prefix}-public-subnet-${count.index}" }
}

# Routing
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ig.id
  }

  tags = { Name = "${var.naming_prefix}-public-route-table" }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public_subnets[*])
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public.id
}

# Subnet Group
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.naming_prefix}-db-subnet-group"
  subnet_ids = aws_subnet.public_subnets[*].id
}
#endregion

#region Security Groups
# Security Groups
resource "aws_security_group" "eb_sg" {
  name        = "${var.naming_prefix}-eb-sg"
  description = "Security group for the Elastic Beanstalk environment"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_vpc_security_group_ingress_rule" "eb_sg" {
  security_group_id = aws_security_group.eb_sg.id
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_security_group" "rds_sg" {
  name        = "${var.naming_prefix}-db-allow-tcp"
  description = "Allow TCP inbound traffic from elastic beanstalk"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_vpc_security_group_ingress_rule" "rds_sg" {
  security_group_id = aws_security_group.rds_sg.id
  from_port         = 1433
  to_port           = 1433
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}
#endregion

#region Database 
# RDS
resource "aws_db_instance" "main_db" {
  identifier             = "${var.naming_prefix}-db"
  username               = var.db_username
  password               = var.db_password
  allocated_storage      = 10
  storage_type           = "gp2"
  engine                 = "mysql"
  engine_version         = "8.0.36"
  instance_class         = "db.t3.micro"
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  license_model          = "general-public-license"
  maintenance_window     = "Mon:00:00-Mon:01:00"
  publicly_accessible    = true
  skip_final_snapshot    = true
  apply_immediately      = true
  copy_tags_to_snapshot  = true
  multi_az               = false
}
#endregion

#region Access Management
# Service Role
resource "aws_iam_role" "elastic_beanstalk_service_role" {
  name               = "${var.naming_prefix}-eb-service-role"
  assume_role_policy = data.aws_iam_policy_document.beanstalk_assume_role.json
}

resource "aws_iam_role_policy_attachment" "elastic_beanstalk_service_role_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth"
  role       = aws_iam_role.elastic_beanstalk_service_role.name
}

resource "aws_iam_role_policy_attachment" "elastic_beanstalk_managed_updates_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy"
  role       = aws_iam_role.elastic_beanstalk_service_role.name
}

# Key pair
resource "aws_key_pair" "ec2_key_pair" {
  key_name   = "${var.naming_prefix}-key-pair"
  public_key = var.ec2_public_key
}

# EB Instance Profile
resource "aws_iam_instance_profile" "eb_instance_profile" {
  name = "${var.naming_prefix}-eb-instance-profile"
  role = aws_iam_role.eb_instance_role.name
}

resource "aws_iam_role" "eb_instance_role" {
  name               = "${var.naming_prefix}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

resource "aws_iam_role_policy_attachment" "eb_rds_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonRDSFullAccess"
  role       = aws_iam_role.eb_instance_role.name
}

resource "aws_iam_role_policy_attachment" "eb_s3_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
  role       = aws_iam_role.eb_instance_role.name
}
#endregion

#region API Infrastructure
# Elastic Beanstalk
resource "aws_elastic_beanstalk_application" "app" {
  name        = "${var.naming_prefix}-app"
  description = "Beanstalk application"
}

resource "aws_elastic_beanstalk_environment" "env" {
  name                = "${var.naming_prefix}-env"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2023 v6.1.3 running Node.js 20"
  cname_prefix        = var.naming_prefix

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.vpc.id
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", aws_subnet.public_subnets[*].id)
  }
  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t3.micro"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.eb_instance_profile.name
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "EC2KeyName"
    value     = aws_key_pair.ec2_key_pair.key_name
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_sg.id
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.elastic_beanstalk_service_role.name
  }
  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "basic"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application"
    name      = "Application Healthcheck URL"
    value     = "/healthcheck"
  }
  dynamic "setting" {
    for_each = var.environment_variables
    content {
      namespace = "aws:elasticbeanstalk:application:environment"
      name      = setting.key
      value     = setting.value
    }
  }

  depends_on = [aws_db_instance.main_db]
}
#endregion