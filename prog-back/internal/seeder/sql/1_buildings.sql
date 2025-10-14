-- Seed buildings (idempotente sin depender de índices únicos)
INSERT INTO
    buildings (name, address, campus, created_at, updated_at)
SELECT
    'Edificio A',
    'Calle Falsa 123',
    'Campus Central',
    now (),
    now ()
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            buildings
        WHERE
            name = 'Edificio A'
    );

INSERT INTO
    buildings (name, address, campus, created_at, updated_at)
SELECT
    'Edificio B',
    'Avenida Siempre Viva 742',
    'Campus Norte',
    now (),
    now ()
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            buildings
        WHERE
            name = 'Edificio B'
    );