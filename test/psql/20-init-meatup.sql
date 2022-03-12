create table meatup(
    id              int generated always as identity,
    title           varchar(128) not null,
    description     varchar(5000),
    datetime_added  timestamptz not null default now(),
    datetime_start  timestamptz not null,
    datetime_end    timestamptz not null,
    latitude        numeric(20, 16) not null,
    longitude       numeric(20, 16) not null,
    owner           uuid not null,
    primary key(id)
);

create table users(
    id              uuid default gen_random_uuid(),
    display_name    varchar(512) not null,
    primary key(id)
);

create table interested(
    user_id         uuid not null,
    meatup_id       int not null
);

alter table meatup
add constraint fk_meatup_owner foreign key(owner) references users(id);

alter table interested
add constraint fk_interested_user foreign key(user_id) references users(id),
add constraint fk_interested_meatup foreign key(meatup_id) references meatup(id);
