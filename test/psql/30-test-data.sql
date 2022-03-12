insert into users(display_name)
values  ('Tyronius Maximus'),
        ('Byronius'),
        ('Tyson'),
        ('Maggie');

insert into meatup(title, description, datetime_start, datetime_end, latitude, longitude, owner)
values  ('The Best Meatup', 'Come on down and enjoy it with us!', now(), now() + 12, 5.0, 10.0001, (select id from users where display_name = 'Tyson'));

insert into interested(user_id, meatup_id)
values  ((select id from users where display_name = 'Byronius'), (select id from meatup where title = 'The Best Meatup')),
        ((select id from users where display_name = 'Maggie'), (select id from meatup where title = 'The Best Meatup'));
