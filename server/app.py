from flask import Flask, request, make_response, jsonify, redirect, url_for
from flask_cors import CORS
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask import session
from flask_session import Session
import os
from werkzeug.utils import secure_filename
from flask import send_from_directory
from flask_restful import Api, Resource
from flask_bcrypt import generate_password_hash
from sqlalchemy import func
from flask_jwt_extended import  JWTManager
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import  timedelta


from models import db, User, Art, Comment, Artist

app = Flask(__name__, static_folder='assets' )
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config ['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
# app.config['SECRET_KEY'] = 'your_secret_key'
# app.config['SESSION_TYPE']='filesystem'

app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)


api = Api(app)

CORS(app)
migrate = Migrate(app, db)

bcrypt = Bcrypt(app)

jwt = JWTManager(app)
revoked_tokens = set()

db.init_app(app)


@app.route('/')
def index():
    return "Index for Art/Comment/Artist/User API"

# SEARCH

@app.route('/arts/search', methods=['POST'])
def search_arts_by_artist():
    data = request.get_json()

    artist_name = data.get('artist_name')

    if artist_name is None:
        return jsonify({'message': 'Artist name parameter is missing'}), 400

    artist = Artist.query.filter(func.lower(Artist.name) == artist_name.lower()).first()

    if not artist:
        return jsonify({'message': 'Artist not found'}), 404

    arts = Art.query.filter_by(artist_id=artist.id).all()

    arts_list = []
    for art in arts:
        art_info = {
            'id': art.id,
            'title': art.title,
            'price': art.price,
            'artist': artist.name,
            'image_path': art.path_to_art
        }
        arts_list.append(art_info)

    return jsonify(arts_list), 200


# CHECKSESSION

class CheckSession(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        if user_id:
            user = User.query.filter_by(id=user_id).first()
            if user:
                user_data = user.to_dict()
                print("User Data:", user_data)  # Print the user data
                return {'user_type': 'user', 'user_data': user_data}, 200
            
            artist = Artist.query.filter_by(id=user_id).first()
            if artist:
                artist_data = artist.to_dict()
                print("Artist Data:", artist_data)  # Print the artist data
                return {'user_type': 'artist', 'user_data': artist_data}, 200
                
        return jsonify({'message': '401: Not Authorized'}), 401

api.add_resource(CheckSession, '/check_session')

# ROUTES FOR ARTIST

@app.route('/artists/registration', methods=['POST'])
def register_artist():
    if request.method == 'POST':
        data = request.get_json()
        name= data.get('name')
        email= data.get('email').strip().lower()
        password= data.get('password')

        existing_artist = Artist.query.filter(func.lower(Artist.email) == email).first()
        
        if existing_artist:
            error_message = "Email already registered. Please use a different email."
            return jsonify({'error': error_message}), 400
        
        new_artist = Artist(name=name, email=email, password=bcrypt.generate_password_hash(password).decode('utf-8'))

        db.session.add(new_artist)
        db.session.commit()

        access_token = create_access_token(identity=new_artist.id, expires_delta=timedelta(hours=24))
        return jsonify({'access_token': access_token}), 201

    return redirect(url_for('index'))

@app.route('/artists/signin', methods=['POST'])
def signin_artist():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email').strip().lower()
        password = data.get('password')

        artist = Artist.query.filter(func.lower(Artist.email) == email).first()

        if artist and bcrypt.check_password_hash(artist.password, password):
            access_token = create_access_token(identity=artist.id, expires_delta=timedelta(hours=24))
            return jsonify({'access_token': access_token}), 200
        else:
            error_message = "Invalid email or password."
            return jsonify({'error': error_message}), 401

    return redirect(url_for('index'))



@app.route('/artists/logout', methods=['DELETE'])
def logout_artist():
    
    session.pop('user_id', None)  

    logout_dict = {'message': 'Logout successful. Goodbye!'}
    response = make_response(
        jsonify(logout_dict),
        200
    )
    return response

# ARTISTS AND ARTS

UPLOAD_FOLDER = 'assets'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/artists/arts', methods=['POST'])
@jwt_required()
def post_art():
    user_id = get_jwt_identity()
    artist = Artist.query.get(user_id)
    
    if not artist:
        return jsonify({'error': 'Unauthorized'}), 401

    if request.method == 'POST':
        title = request.form.get('title')
        price = request.form.get('price')
        file = request.files['file']

        if 'file' not in request.files or file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            new_art = Art(title=title, artist_id=artist.id, price=price, path_to_art=filepath)

            db.session.add(new_art)
            db.session.commit()

            return jsonify({'message': 'Art posted successfully'}), 201

        return jsonify({'error': 'Invalid file format'}), 400

    return redirect(url_for('index'))


   
@app.route('/artists/arts/<int:art_id>', methods=['DELETE'])
@jwt_required()
def delete_art(art_id):
    user_id = get_jwt_identity()
    artist = Artist.query.get(user_id)
    art = Art.query.get(art_id)

    if not artist or not art:
        return jsonify({'error': 'Art not found'}), 404

    if art.artist_id != artist.id:
        return jsonify({'error': 'Unauthorized'}), 401

    if request.method == 'DELETE':
        if os.path.exists(art.path_to_art):
            os.remove(art.path_to_art)

        db.session.delete(art)
        db.session.commit()
        return jsonify({'message': 'Art deleted successfully'}), 200

    return redirect(url_for('index'))



# ARTISTS & COMMENTS

@app.route('/artists/comments', methods=['POST'])
@jwt_required()
def artist_post_comment():
    user_id = get_jwt_identity()
    artist = Artist.query.get(user_id)
    
    if not artist:
        return jsonify({'error': 'Unauthorized'}), 401

    if request.method == 'POST':
        data = request.get_json()
        text = data.get('text')
        art_id = data.get('art_id')  

        new_comment = Comment(text=text, artist_id=artist.id, art_id=art_id)

        db.session.add(new_comment)
        db.session.commit()

        return jsonify({'message': 'Comment posted successfully'}), 201

    return redirect(url_for('index'))

@app.route('/artists/comments/<int:comment_id>', methods=['PATCH', 'DELETE'])
def user_edit_comment(comment_id):
    user_id = session.get('user_id')
    artist = Artist.query.get(user_id)
    comment = Comment.query.get(comment_id)

    if not artist or not comment:
        return "Comment not found", 404

    if comment.artist_id != artist.id:
        return "Unauthorized", 401

    if request.method == 'PATCH':
        new_text = request.form.get('text')
        comment.text = new_text
        db.session.commit()
        return jsonify({'message': 'Comment updated successfully'}), 200

    elif request.method == 'DELETE':
        db.session.delete(comment)
        db.session.commit()
        return jsonify({'message': 'Comment deleted successfully'}), 200

    return redirect(url_for('index'))


# USERS


@app.route('/users/registration', methods=['POST'])
def register_user():
    if request.method == 'POST':
        data = request.get_json() 
        username = data.get('username').strip().lower()
        password = data.get('password')
        
        existing_user = User.query.filter(func.lower(User.username) == username).first()
        if existing_user:
            return jsonify({'error': 'Username already registered. Please use a different username.'}), 400

        # You can hash the password here, for example:
        hashed_password = hash(password)
        
        new_user = User(username=username, password=bcrypt.generate_password_hash(password).decode('utf-8'))

        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id)
        return jsonify({'access_token': access_token}), 201

    return redirect(url_for('index'))

@app.route('/users/signin', methods=['POST'])
def signin_user():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username').strip().lower()
        password = data.get('password')

        user = User.query.filter(func.lower(User.username) == username).first()

        # Check password using bcrypt
        if user and bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=24))
            return jsonify({'access_token': access_token}), 200
        else:
            error_message = "Invalid username or password."
            return jsonify({'error': error_message}), 401

    return redirect(url_for('index'))


# USER && COMMENTS

@app.route('/users/comments', methods=['POST'])
@jwt_required()
def user_post_comment_user():
    user_id = get_jwt_identity()
    
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if request.method == 'POST':
        data = request.get_json()
        text = data.get('text')
        art_id = data.get('art_id')

        new_comment = Comment(text=text, user_id=user_id, art_id=art_id)

        db.session.add(new_comment)
        db.session.commit()

        return jsonify({'message': 'Comment posted successfully'}), 201

    return redirect(url_for('index'))


@app.route('/users/comments/<int:comment_id>', methods=['PATCH', 'DELETE'])
def user_edit_comment_user(comment_id):
    user_id = session.get('user_id')
    comment = Comment.query.get(comment_id)

    
    if not user_id or comment.user_id != user_id:
        return "Unauthorized", 401

    if request.method == 'PATCH':
        new_text = request.form.get('text')
        comment.text = new_text
        db.session.commit()
        return jsonify({'message': 'Comment updated successfully'}), 200

    elif request.method == 'DELETE':
        db.session.delete(comment)
        db.session.commit()
        return jsonify({'message': 'Comment deleted successfully'}), 200

    return redirect(url_for('index'))


# GETTING ALL COMMENTS FOR AN ART

@app.route('/arts/<int:art_id>/comments', methods=['GET'])
def get_comments_for_art(art_id):
    art = Art.query.get(art_id)
    if not art:
        return "Art not found", 404

    comments = Comment.query.filter_by(art_id=art_id).all()

    comments_list = []
    for comment in comments:
        if comment.artist:  
            author_name = comment.artist.name
        elif comment.user:  
            author_name = comment.user.username
        else:
            author_name = "Unknown"  

        comment_info = {
            'text': comment.text,
            'author_name': author_name,
            
        }
        comments_list.append(comment_info)

    return jsonify(comments_list), 200


# GETTING ALL ARTS

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(app.static_folder, filename)


@app.route('/arts', methods=['GET'])
def get_all_arts():
    arts = Art.query.all()

    arts_list = []
    for art in arts:
        artist_name = art.artist.name if art.artist else "Unknown Artist"
        image_path = os.path.join(request.url_root, art.path_to_art.lstrip('/'))
        #print("Image Path:", image_path)  
        art_info = {
            'id': art.id,
            'title': art.title,
            'price': art.price,
            'artist': artist_name,
            'image_path': image_path
        }
        arts_list.append(art_info)

    return jsonify(arts_list), 200





if __name__ == '__main__':
    app.run(port=5555)
