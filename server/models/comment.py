from . import db
from sqlalchemy_serializer import SerializerMixin


class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    art_id = db.Column(db.Integer, db.ForeignKey('arts.id'))

    
    def __repr__(self):
        return f"<Comment(id={self.id}, text={self.text}, artist_id={self.artist_id}, user_id={self.user_id}, art_id={self.art_id})>"
