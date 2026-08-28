from sqlalchemy import create_engine, text

engine = create_engine("postgresql://postgres:postgres@localhost:5432/buildgig")
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR UNIQUE;"))
    except Exception as e:
        print(e)
    try:
        conn.execute(text("ALTER TABLE users ALTER COLUMN email DROP NOT NULL;"))
    except Exception as e:
        print(e)
    conn.commit()
    print("Migration complete")
