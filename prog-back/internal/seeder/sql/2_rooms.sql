-- Seed rooms (idempotente). Assumes buildings exist with these names.
-- We'll insert referencing building ids via subquery to keep it idempotent.
-- Insert Aula 101 if not exists
INSERT INTO
    rooms (
        building_id,
        name,
        capacity,
        resources,
        description,
        created_at,
        updated_at
    )
SELECT
    (
        SELECT
            id
        FROM
            buildings
        WHERE
            name = 'Edificio A'
        LIMIT
            1
    ),
    'Aula 101',
    40,
    '["pizarra","proyector","enchufes"]',
    'Aula grande con proyector',
    now (),
    now ()
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            rooms
        WHERE
            name = 'Aula 101'
            AND building_id = (
                SELECT
                    id
                FROM
                    buildings
                WHERE
                    name = 'Edificio A'
                LIMIT
                    1
            )
    );

-- Insert Aula 102 if not exists
INSERT INTO
    rooms (
        building_id,
        name,
        capacity,
        resources,
        description,
        created_at,
        updated_at
    )
SELECT
    (
        SELECT
            id
        FROM
            buildings
        WHERE
            name = 'Edificio A'
        LIMIT
            1
    ),
    'Aula 102',
    30,
    '["pizarra","enchufes"]',
    'Aula mediana',
    now (),
    now ()
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            rooms
        WHERE
            name = 'Aula 102'
            AND building_id = (
                SELECT
                    id
                FROM
                    buildings
                WHERE
                    name = 'Edificio A'
                LIMIT
                    1
            )
    );

-- Insert Aula 201 if not exists
INSERT INTO
    rooms (
        building_id,
        name,
        capacity,
        resources,
        description,
        created_at,
        updated_at
    )
SELECT
    (
        SELECT
            id
        FROM
            buildings
        WHERE
            name = 'Edificio B'
        LIMIT
            1
    ),
    'Aula 201',
    50,
    '["pizarra","proyector"]',
    'Sala grande para seminarios',
    now (),
    now ()
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            rooms
        WHERE
            name = 'Aula 201'
            AND building_id = (
                SELECT
                    id
                FROM
                    buildings
                WHERE
                    name = 'Edificio B'
                LIMIT
                    1
            )
    );