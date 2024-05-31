output "backend_endpoint" {
  value = aws_elastic_beanstalk_environment.env.cname
}

output "frontend_endpoint" {
  value = aws_s3_bucket_website_configuration.app.website_endpoint
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.app.domain_name
}