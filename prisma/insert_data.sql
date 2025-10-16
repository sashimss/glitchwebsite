-- Drop temp table if exists
DROP TABLE IF EXISTS temp_students;

-- Create temp table
CREATE TEMP TABLE temp_students (
    email TEXT,
    hostel_name TEXT
);

-- Load CSV from local machine (no semicolon at the end)
\copy temp_students(hostel_name,email ) FROM '/home/panshul/Desktop/Documents/Lambda/glitchwebsite/prisma/students.csv' DELIMITER ',' CSV HEADER

-- Insert into StudentHostels
INSERT INTO "StudentHostels" (email, hostel_id)
SELECT
    t.email,
    h.id
FROM
    temp_students t
JOIN
    "Hostels" h
ON
    t.hostel_name = h.name
ON CONFLICT (email) DO NOTHING;
