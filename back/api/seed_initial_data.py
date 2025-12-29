from sqlmodel import SQLModel, create_engine, Session, select
from api.sqlmodels import Category, Exercise

DB_URL = "mysql+pymysql://root@db:3306/demo?charset=utf8"


def seed():
    engine = create_engine(DB_URL, echo=True)

    # Ensure tables exist
    SQLModel.metadata.create_all(engine)

    groups = {
        "胸": [
            "ベンチプレス",
            "ダンベルフライ",
            "プッシュアップ",
            "インクラインベンチ",
            "チェストプレス",
        ],
        "背中": [
            "ラットプルダウン",
            "デッドリフト",
            "バーベルロウ",
            "シーテッドロー",
            "ワンハンドダンベルロー",
        ],
        "脚": [
            "スクワット",
            "レッグプレス",
            "ランジ",
            "レッグエクステンション",
            "ハムストリングカール",
        ],
        "肩": [
            "ショルダープレス",
            "サイドレイズ",
            "フロントレイズ",
            "リアデルトフライ",
            "アップライトロウ",
        ],
        "腕": [
            "バーベルカール",
            "ハンマーカール",
            "トライセプスプレスダウン",
            "ダンベルキックバック",
            "コンセントレーションカール",
        ],
    }

    with Session(engine) as session:
        for gname, ex_list in groups.items():
            stmt = select(Category).where(Category.name == gname)
            cat = session.exec(stmt).first()
            if not cat:
                cat = Category(name=gname)
                session.add(cat)
                session.commit()
                session.refresh(cat)

            for ex_name in ex_list:
                stmt = select(Exercise).where(
                    Exercise.name == ex_name, Exercise.category_id == cat.id
                )
                existing = session.exec(stmt).first()
                if not existing:
                    ex = Exercise(name=ex_name, category_id=cat.id)
                    session.add(ex)

            session.commit()

    print("Seed complete: inserted/ensured muscle groups and exercises")


if __name__ == "__main__":
    seed()
