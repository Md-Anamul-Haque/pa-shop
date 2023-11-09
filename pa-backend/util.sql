
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();
-- uuid_generate_v4           
-- ------------------------------------
--  579fc6f0-21c8-44ae-8015-fc0fbc33ec5d
-- (1 row)





