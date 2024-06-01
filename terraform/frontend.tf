resource "aws_s3_bucket" "app" {
  bucket        = var.bucket_name
  force_destroy = true
  tags          = { Name = var.bucket_name }
}

resource "aws_s3_bucket_versioning" "source_versioning" {
  bucket = aws_s3_bucket.app.bucket
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "app" {
  bucket = aws_s3_bucket.app.bucket

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "bucket-policy" {
  bucket = aws_s3_bucket.app.bucket
  policy = data.aws_iam_policy_document.bucket-policy.json

  depends_on = [aws_s3_bucket_public_access_block.app]
}

resource "aws_s3_bucket_website_configuration" "app" {
  bucket = aws_s3_bucket.app.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "pages/404.html"
  }
}

resource "aws_s3_bucket_cors_configuration" "app" {
  bucket = aws_s3_bucket.app.bucket

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = [aws_s3_bucket_website_configuration.app.website_endpoint]
    max_age_seconds = 3000
  }
}

resource "aws_cloudfront_distribution" "app" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.app.website_endpoint
    origin_id   = aws_s3_bucket.app.bucket

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "S3 bucket for ${aws_s3_bucket.app.bucket}"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.app.bucket

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  aliases = ["myplanner.projects.bbdgrad.com"]

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:774089569115:certificate/0292fc3d-f0a7-4d3b-991a-62677288ad48"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = var.bucket_name
  }
}