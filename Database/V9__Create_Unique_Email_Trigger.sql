-- Create function to prevent updates to email column
CREATE OR REPLACE FUNCTION prevent_email_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.email IS DISTINCT FROM NEW.email THEN
    RAISE EXCEPTION 'The email column is immutable and cannot be updated';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce immutability of email column
CREATE TRIGGER prevent_email_update_trigger
BEFORE UPDATE ON "Users"
FOR EACH ROW
EXECUTE FUNCTION prevent_email_update();