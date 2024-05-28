# Subnet Group
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.naming_prefix}-db-subnet-group"
  subnet_ids = aws_subnet.public_subnets[*].id
}

# Security Groups
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