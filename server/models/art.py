from . import db
from sqlalchemy_serializer import SerializerMixin


class Art(db.Model, SerializerMixin):
    __tablename__ = 'arts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))  
    price = db.Column(db.Float, nullable=True)  
    path_to_art = db.Column(db.String(256), nullable=False)
    

    comments = db.relationship('Comment', backref='art', lazy=True)
      

    def __repr__(self):
        return f"<Art(id={self.id}, title={self.title}, artist={self.artist}, price={self.price}, path_to_art={self.path_to_art}, artist_id={self.artist_id})>"