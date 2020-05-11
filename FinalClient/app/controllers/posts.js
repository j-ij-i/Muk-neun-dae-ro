const {getNameByCode} = require('../../helper/utility');
const {API_URL,SERVICEKEY} = require('../../config/enviroment');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Upload = mongoose.model('Upload');
const numcounter = mongoose.model('numcounter');
const pageTitle = "게시판";
console.log('call : /controllers/posts.js');
const only = require('only');

var numcount=new numcounter({"totalCount":0});
exports.postindex = function (req, res) {
	const isLogin = req.isAuthenticated();
    //로그인이 되어있나 확인
    Post.list(function (posts) { 
        //Post 모델에 저장한 static 함수인 list 이용
	res.render('posts/postindex',{  //postindex 렌더링
        posts: posts,
		isUserLogedIn: req.isAuthenticated(),
        });
         //뷰 템플릿 랜더링(템플릿:postindex.hbs)
	 });
};

exports.postorderindex = function (req, res) {
     const isLogin = req.isAuthenticated();
        Post.orderlist(function (posts) { 
      //Post 모델에 저장한 static 함수인 orderlist 이용
	res.render('posts/postorderindex',{
            posts:posts,
		isUserLogedIn: req.isAuthenticated(),
        });
	 });
};


exports.postshow = function (req, res){
    //Post의 static함수인 load 실행
     const isLogin = req.isAuthenticated();
    Post.load(req.params.id, function (post) {
        //요청을 한 게시물의 아이디를 가지고오고 
        //그 와 함께 일단 사람들이 보았기 때문에 조회수를 나타내는 view+1
        post.views=post.views+1;
        post.save();
        res.render('posts/postshow', {
			//뷰 템플릿 랜더링(템플릿:postshow.hbs)
            post: post,
			user:req.user.userId,
			isUserLogedIn: req.isAuthenticated(),
        });
    });
};

exports.postcreate = function (req, res) {
    //작성하는 화면 생성
     const isLogin = req.isAuthenticated();
    res.render('posts/postcreate', {
		user:req.user.userId,
		//userid를 불러와서 글 작성시 자동으로 작성자명에 회원의 아이디가 입력되게 된다.
		isUserLogedIn: req.isAuthenticated(),
	});
};

exports.poststore = function (req, res) {
     const isLogin = req.isAuthenticated();
    //작성을 저장하는 부분
    const post = new Post();
	console.log(req.body.author);
    //받아온 정보들을 각각 저장
    post.title = req.body.title;
    post.content = req.body.content;
	post.author= req.user.userId;
	//user id를 받아와서 author에 저장.
    //글이 하나 더 증가했으므로 게시글 번호 증가를 위해 ++
    numcount.totalCount++;
    numcount.save();
    
    post.numId=numcount.totalCount;                         
    //게시글 번호 지정
    post.save(function (err, result) { //저장
        if (err) {
           
            res.sendStatus(400)
        }

        if (req.files.length > 0) { //파일이 있는 경우
            console.log("파일있음");
            req.files.forEach(function (file) {
                const upload = new Upload({
                    relatedId: result,
                    type: "post",
                    filename: file.filename,
                    originalname: file.originalname,
                    type: file.mimetype,
                    size: file.size,
                });

                upload.save(function (err, result) { //사진 저장
                    post.photo = result;
                    post.save();
                });

            });
        }
        res.redirect('/postindex');

    });
};

exports.postupdate = function (req, res) {
    console.log(req.files.length);
    Post.load(req.body.id, function (post) { 
        //가장 먼저 값 로드해줌
        //그 후 각각의 요소들의 값을 넣어주고 저장함으로써 
        //원하는 갑으로 변경
        post.title = req.body.title;
        post.content = req.body.content;
        post.author = req.user.userId;
        post.save(function (err, result) {
              
            if (err) {
                res.sendStatus(400)
            }

            if (req.files.length > 0) {

                console.log("파일있음");

                req.files.forEach(function (file) {
                    const upload = new Upload({
                        relatedId: result,
                        type: "post",
                        filename: file.filename,
                        originalname: file.originalname,
                        type: file.mimetype,
                        size: file.size,
                    });

                    upload.save(function (err, result) {
                        post.photo = result;
                        post.save();
                    });

                });
            }
            res.redirect('/postindex');
        })
    });
};


exports.postedit = function (req, res) {
     const isLogin = req.isAuthenticated();
    Post.load(req.params.id, function (post) {
        res.render('posts/postedit', {
            post: post,
        isUserLogedIn: req.isAuthenticated(),
		});
    });
};


exports.postdelete = function (req, res) {
     const isLogin = req.isAuthenticated();
    console.log(req.params.id);
    Post.deleteOne({
        _id: req.params.id
    }, function (err, result) {
        if (err) return res.send(err);
        res.redirect('/postindex');
    });
};

exports.postsearch = async function (req, res) {
     const isLogin = req.isAuthenticated();
    var quest=String(req.query.quest);
    var qtype=Number(req.query.search);
    
    //가장 먼저 찾으려는 문자열과 선택한 select 갑을 quest, qtype 변수에 저장
    
    console.log(quest);
    console.log(qtype);
    
    if(qtype==1){   //내용으로 찾기를 누른경우
    Post.findcontentlist(quest,function(posts) {
	res.render('posts/questres',{
            posts:posts,
        isUserLogedIn: req.isAuthenticated()
        }); 
	 });  
    }
    
    else if(qtype==2){  //작성자로 찾기를 누른경우
    Post.findauthorlist(quest,function(posts) {
	res.render('posts/questres',{
            posts:posts,
         isUserLogedIn: req.isAuthenticated()
        }); 
	 });  
    }
    
    else{  //제목으로 찾기를 누른경우
    Post.findtitlelist(quest,function(posts) { 
	res.render('posts/questres',{
            posts:posts,
         isUserLogedIn: req.isAuthenticated()
        }); 
	 });  
    }
};
