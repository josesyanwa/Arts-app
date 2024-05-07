from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin



db = SQLAlchemy()

from .art import Art
from .comment import Comment
from .user import User
from .artist import Artist


app = Flask(__name__)

