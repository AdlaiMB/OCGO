DROP VIEW IF EXISTS comment_info;
DROP VIEW IF EXISTS location_info;

-- all comment related info into one view
CREATE OR REPLACE VIEW comment_info AS
  SELECT C.user_id, C.comment_id, C.location_id, U.name AS user_name, L.name AS location_name, comment, upvotes, downvotes
  FROM Comments C 
  LEFT JOIN Users U USING (user_id)
  INNER JOIN Locations L USING (location_id);

-- all location related info into one view
CREATE OR REPLACE VIEW location_info AS
  SELECT location_id, user_id, U.name as user_name, L.name AS location_name, city, category, address, url, description, hours
  FROM Locations L
  LEFT JOIN Users U USING (user_id)
  NATURAL JOIN
  (SELECT location_id, json_object_agg(day, json_build_array(open, close)) hours
   FROM Hours
   GROUP BY location_id);