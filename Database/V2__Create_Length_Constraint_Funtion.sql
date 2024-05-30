-- Create function to get the end of the day
CREATE OR REPLACE FUNCTION end_of_day(ts TIMESTAMP)
RETURNS TIMESTAMP AS $$
BEGIN
  RETURN date_trunc('day', ts) + INTERVAL '1 day' - INTERVAL '1 second';
END;
$$ LANGUAGE plpgsql;