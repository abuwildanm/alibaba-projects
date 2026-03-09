# Lovara Database Schema

## Users Table
- id (Primary Key, UUID/String)
- name (String)
- email (String, Unique)
- password_hash (String)
- age (Integer)
- gender (String)
- bio (Text)
- profile_pic_url (String)
- location (JSON - latitude, longitude)
- distance_preference (Integer)
- age_min_preference (Integer)
- age_max_preference (Integer)
- gender_preference (String)
- is_active (Boolean)
- last_active (DateTime)
- created_at (DateTime)
- updated_at (DateTime)

## User_Photos Table
- id (Primary Key, UUID/String)
- user_id (Foreign Key to Users)
- photo_url (String)
- is_profile_photo (Boolean)
- created_at (DateTime)

## Interests Table
- id (Primary Key, UUID/String)
- name (String, Unique)

## User_Interests Junction Table
- id (Primary Key, UUID/String)
- user_id (Foreign Key to Users)
- interest_id (Foreign Key to Interests)

## Matches Table
- id (Primary Key, UUID/String)
- user1_id (Foreign Key to Users)
- user2_id (Foreign Key to Users)
- status (String - 'matched', 'unmatched')
- created_at (DateTime)

## Conversations Table
- id (Primary Key, UUID/String)
- user1_id (Foreign Key to Users)
- user2_id (Foreign Key to Users)
- created_at (DateTime)
- updated_at (DateTime)

## Messages Table
- id (Primary Key, UUID/String)
- conversation_id (Foreign Key to Conversations)
- sender_id (Foreign Key to Users)
- message_text (Text)
- is_read (Boolean)
- sent_at (DateTime)

## Events Table
- id (Primary Key, UUID/String)
- title (String)
- description (Text)
- date (Date)
- time (Time)
- location (String)
- creator_id (Foreign Key to Users)
- max_attendees (Integer)
- created_at (DateTime)
- updated_at (DateTime)

## Event_Attendees Junction Table
- id (Primary Key, UUID/String)
- event_id (Foreign Key to Events)
- user_id (Foreign Key to Users)
- joined_at (DateTime)

## User_Settings Table
- id (Primary Key, UUID/String)
- user_id (Foreign Key to Users)
- notification_likes (Boolean)
- notification_matches (Boolean)
- notification_messages (Boolean)
- notification_events (Boolean)
- privacy_show_me (Boolean)
- privacy_show_distance (Boolean)
- privacy_show_age (Boolean)
- created_at (DateTime)
- updated_at (DateTime)

## Blocks Table
- id (Primary Key, UUID/String)
- blocker_id (Foreign Key to Users)
- blocked_id (Foreign Key to Users)
- created_at (DateTime)

## Reports Table
- id (Primary Key, UUID/String)
- reporter_id (Foreign Key to Users)
- reported_id (Foreign Key to Users)
- reason (String)
- description (Text)
- created_at (DateTime)