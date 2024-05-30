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

# Private Subnets
resource "aws_subnet" "private_subnets" {
  count                   = length(var.vpc_private_subnets)
  cidr_block              = var.vpc_private_subnets[count.index]
  vpc_id                  = aws_vpc.vpc.id
  map_public_ip_on_launch = false
  availability_zone       = var.vpc_azs[count.index % length(var.vpc_azs)]

  tags = { Name = "${var.naming_prefix}-private-subnet-${count.index}" }
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