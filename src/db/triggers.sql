CREATE OR REPLACE FUNCTION update_comment_vote() RETURNS trigger AS $$
  DECLARE
    old_vote_col TEXT;
    new_vote_col TEXT;
    old_vote_cnt bigint;
    new_vote_cnt bigint;
  BEGIN
    IF OLD.vote = 'upvote' THEN
      old_vote_col := 'upvotes';
      new_vote_col := 'downvotes';
    ELSE
      old_vote_col := 'downvotes';
      new_vote_col := 'upvotes';
    END IF;

    EXECUTE format('SELECT %I FROM Comments WHERE comment_id = $1', old_vote_col) INTO old_vote_cnt USING OLD.comment_id;
    new_vote_cnt := old_vote_cnt - 1;
    EXECUTE format('UPDATE Comments SET %I = $1 WHERE comment_id = $2', old_vote_col) USING new_vote_cnt, OLD.comment_id;

    EXECUTE format('SELECT %I FROM Comments WHERE comment_id = $1', new_vote_col) INTO old_vote_cnt USING OLD.comment_id;
    new_vote_cnt := old_vote_cnt + 1;
    EXECUTE format('UPDATE Comments SET %I = $1 WHERE comment_id = $2', new_vote_col) USING new_vote_cnt, OLD.comment_id;
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_comment_vote() RETURNS trigger AS $$
  DECLARE 
    vote_col     TEXT;
    old_vote_cnt bigint;
    new_vote_cnt bigint;
  BEGIN 
    IF NEW.vote = 'upvote' THEN
      vote_col := 'upvotes';
    ELSE
      vote_col := 'downvotes';
    END IF;

    EXECUTE format('SELECT %I FROM Comments WHERE comment_id = $1', vote_col) INTO old_vote_cnt USING NEW.comment_id;
    new_vote_cnt := old_vote_cnt + 1;
    EXECUTE format('UPDATE Comments SET %I = $1 WHERE comment_id = $2', vote_col) USING new_vote_cnt, NEW.comment_id;
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_comment_vote() RETURNS trigger AS $$
  DECLARE 
    vote_col     TEXT;
    old_vote_cnt bigint;
    new_vote_cnt bigint;
  BEGIN 
    IF OLD.vote = 'upvote' THEN
      vote_col := 'upvotes';
    ELSE
      vote_col := 'downvotes';
    END IF;

    EXECUTE format('SELECT %I FROM Comments WHERE comment_id = $1', vote_col) INTO old_vote_cnt USING OLD.comment_id;
    new_vote_cnt := old_vote_cnt - 1;
    EXECUTE format('UPDATE Comments SET %I = $1 WHERE comment_id = $2', vote_col) USING new_vote_cnt, OLD.comment_id;
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_comment_vote
  AFTER UPDATE ON Votes
  FOR EACH ROW 
  WHEN (OLD.vote IS DISTINCT FROM NEW.vote)
  EXECUTE FUNCTION update_comment_vote();

CREATE OR REPLACE TRIGGER insert_comment_vote
  AFTER INSERT ON Votes
  FOR EACH ROW
  EXECUTE FUNCTION insert_comment_vote();

CREATE OR REPLACE TRIGGER delete_comment_vote
  AFTER DELETE ON Votes
  FOR EACH ROW
  EXECUTE FUNCTION delete_comment_vote();
