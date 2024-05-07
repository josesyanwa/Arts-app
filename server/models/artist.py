from . import db
from flask_bcrypt import Bcrypt
from flask import Flask
from sqlalchemy_serializer import SerializerMixin


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

bcrypt = Bcrypt(app)

class Artist(db.Model, SerializerMixin):

    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)  
    password = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
        }
   

    arts = db.relationship('Art', backref='artist', lazy=True)
    comments = db.relationship('Comment', backref='artist', lazy=True) 
    
     

    def __repr__(self):
        return f"<Artist(id={self.id}, name={self.name}, email={self.email})>"