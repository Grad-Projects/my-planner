variable "common_tags" {
  type        = map(string)
  description = "Common tags applied to all resources"
}

variable "region" {
  type        = string
  description = "The region where the resources will be deployed."
}

variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC."
}

variable "vpc_azs" {
  type        = list(string)
  description = "The availability zones for the VPC."
}

variable "vpc_public_subnets" {
  type        = list(string)
  description = "The public subnets for the VPC."
}

variable "ec2_public_key" {
  type        = string
  description = "The public key to use for the EC2 instance."
}

variable "db_username" {
  type        = string
  description = "The username for the database."
}

variable "db_password" {
  type        = string
  description = "The password for the database."
  sensitive   = true
}

variable "naming_prefix" {
  type        = string
  description = "The prefix to use for naming resources."
}

variable "environment_variables" {
  type        = map(string)
  description = "Environment variables to set on the Elastic Beanstalk environment."
}

variable "cors_allowed_origins" {
  type        = list(string)
  description = "The domains allowed in the CORS configuration."
}

variable "bucket_name" {
  type        = string
  description = "Name of the bucket."
}

variable "client_id" {
  type        = string
  description = "The client ID for the identity provider."
}

variable "client_secret" {
  type        = string
  description = "The client secret for the identity provider."
  sensitive   = true
}