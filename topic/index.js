var html = document.getElementsByTagName('html')[0];
	html.style.fontSize = document.documentElement.clientWidth / 32 + 'px';

var Topic = React.createClass({
	getDefaultProps: function(){
		return {
			"topic_info":{
				"src": "images/avater.jpg",
				"title": "天心",
				"numBrowse": 123,
				"numPhoto": 456,
				"hotNum": 15,
				"process": "90%"
			},
			"topic_members":{
				members:[
					{"uid":123, "avatar": "./images/avater.jpg"},
					{"uid":123, "avatar": "./images/avater.jpg"},
					{"uid":123, "avatar": "./images/avater.jpg"},
					{"uid":123, "avatar": "./images/avater.jpg"},
					{"uid":123, "avatar": "./images/avater.jpg"},
					{"uid":123, "avatar": "./images/avater.jpg"},
					{"uid":123, "avatar": "./images/avater.jpg"},
					{"uid":123, "avatar": "./images/avater.jpg"}
				],
				"numMember": 1732
			},
			"topic_hotest":{
				"countEssence": 12,
				"topPost":[
					"题主置顶了天心的一组照片",
					"题主置顶了天心的一组照片",
					"题主置顶了天心的一组照片"
				]
			},
			"topic_posts":[
				{
					"avatar": "./images/avater.jpg",
					"userName": "天心",
					"numBrowse": 9623,
					"time": "08-25",
					"desc": "所有逃避你的时间，我都会后悔！",
					"images": [
						"./images/avater.jpg",
						"./images/avater.jpg",
						"./images/avater.jpg"
					],
					"likeCount": 123,
					"likeFriends":[
						{"uid":1, "avatar": "images/avater.jpg"},
						{"uid":1, "avatar": "images/avater.jpg"},
						{"uid":1, "avatar": "images/avater.jpg"},
						{"uid":1, "avatar": "images/avater.jpg"},
						{"uid":1, "avatar": "images/avater.jpg"},
						{"uid":1, "avatar": "images/avater.jpg"},
						{"uid":1, "avatar": "images/avater.jpg"}
					],
					"comments": [
						{"name": "天心", "word": "你是什么样的人，取决于你做的决定！"},
						{"name": "天心", "word": "你是什么样的人，取决于你做的决定！"},
						{"name": "天心", "word": "你是什么样的人，取决于你做的决定！"},
						{"name": "天心", "word": "你是什么样的人，取决于你做的决定！"},
						{"name": "天心", "word": "你是什么样的人，取决于你做的决定！"}
					],
					"numMore": 12
				}
			]
		}
	},
	render:function (){
		var posts = [];
		for(var i = 0; i < 10; i++){
			posts.push(<Topic.Post key={i} topicPosts={this.props.topic_posts}/>);
		}

		return (
			<div>
				<Topic.Header topicInfo={this.props.topic_info} topicMembers={this.props.topic_members} />
				<Topic.Nav />
				<Topic.Hotest topicHotest={this.props.topic_hotest}/>
				{posts}
			</div>
		)
	}
});

Topic.Header = React.createClass({
	render:function (){
		return (
			<div className="header">
				<Topic.Info topicInfo={this.props.topicInfo}/>
				<Topic.Members topicMembers={this.props.topicMembers}/>
			</div>
		)
	}
})

Topic.Info = React.createClass({
	getDefaultProps: function(){
		// console.log(this.props)
		// return {
		// 	src: 'images/avater.jpg',
		// 	title: '天心',
		// 	numBrowse: 123,
		// 	numPhoto: 456,
		// 	hotNum: 15,
		// 	process: '90%'
		// }
	},
	componentWillMount: function(){
		this.props = this.props.topicInfo;
	},
	render: function (){
		var hotProcess = this.props.process;

		return (
			<div className="topic-info clearfix">
				<a className="topic-cover">
					<img className="bg" src={this.props.src}/>
				</a>
				<div className="topic-right">
					<div className="topic-title">{this.props.title}</div>
					<div className="topic-data">
						<div className="num num-browse">{this.props.numBrowse}</div>
						<div className="num num-photo">{this.props.numPhoto}</div>
					</div>
					<div className="topic-hot">
		                <span className="hot-num">{this.props.hotNum}w</span>
		                <div className="hot-bar">
		                    <div className="bar-par">
		                    	<div className="bar" style={{'width':hotProcess}}></div>
		                    </div>
		                </div>
		            </div>
				</div>
			</div>
		)
	}
});

Topic.Members = React.createClass({
	getDefaultProps: function(){
		// return {
		// 	members:[
		// 		{"uid":123, "avatar": "./images/avater.jpg"},
		// 		{"uid":123, "avatar": "./images/avater.jpg"},
		// 		{"uid":123, "avatar": "./images/avater.jpg"},
		// 		{"uid":123, "avatar": "./images/avater.jpg"},
		// 		{"uid":123, "avatar": "./images/avater.jpg"},
		// 		{"uid":123, "avatar": "./images/avater.jpg"},
		// 		{"uid":123, "avatar": "./images/avater.jpg"},
		// 		{"uid":123, "avatar": "./images/avater.jpg"}
		// 	],
		// 	numMember: 1732
		// }
	},
	componentWillMount: function(){
		this.props = this.props.topicMembers;
	},
	render: function(){
		var members = this.props.members;
		return (
			<div className="topic-members">
				<a href="#" className="member-wrapper clearfix">
					{members.map(function(item, index){
						return (
							<div key={index} className="member-avatar">
								<span  style={{'backgroundImage': 'url(' + item.avatar + ')'}}></span>
							</div>
						)
					})}
					<span className="num-member">{this.props.numMember}人</span>
				</a>
			</div>
		)
	}
})

Topic.Nav = React.createClass({
	getInitialState: function(){
		return {
			active:true,
			fixed: false
		}	
	},
	handleClick: function(type){
		if(type == "hotest"){
			return	function(){
				this.setState({
					active:true
				})
			}.bind(this)
		}else if(type == "newest"){
			return	function(){
				this.setState({
					active:false
				})
			}.bind(this)
		}
	},
	componentDidMount: function(){
		var top = this.refs.nav.offsetTop;
		var self = this;
		window.onscroll  = function(){
			var scrollTop = document.body.scrollTop;
			if(scrollTop > top){
				self.setState({
					fixed:true
				})
			}else{
				self.setState({
					fixed:false
				})
			}
		}
	},
	render: function(){
		return (
			<div className={"topic-nav clearfix " + (this.state.fixed ? "fixed" : "")} ref="nav">
				<div className={"content content-hotest "+ (this.state.active ? "target" : "")} onClick={this.handleClick("hotest")}>
					最热
				</div>
				<div className={"content content-newest "+ (this.state.active ? "" : "target")} onClick={this.handleClick("newest")}>
					最新
				</div>
				<div className={"bottom-bar " + (this.state.active ? "" : "active")}></div>
			</div>
		)
	}
})

Topic.Hotest = React.createClass({
	getDefaultProps: function(){
		// return {
		// 	countEssence: 12,
		// 	topPost:[
		// 		"题主置顶了天心的一组照片",
		// 		"题主置顶了天心的一组照片",
		// 		"题主置顶了天心的一组照片"
		// 	]
		// }
	},
	componentWillMount: function(){
		this.props = this.props.topicHotest;
	},
	render: function(){
		var topPost = this.props.topPost;
		return (
			<div>
				<a className="essence-post" href="#">
					<p>精华帖</p>
					<div className="count">{this.props.countEssence}</div>
				</a>
				{topPost.map(function(item, index){
					return (
						<a key={index} className="sticky-post" href="#">
							<p>{item}</p>
						</a>
					)
				})}
			</div>
		)
	}
})

Topic.Post = React.createClass({
	getDefaultProps: function(){
		
	},
	componentWillMount: function(){
		this.props = this.props.topicPosts;
	},
	render: function(){
		return (
			<div className="post-ele-wrapper">
				<div className="post-ele">
					<Topic.PostHeader />
					<Topic.PostContent />
					<Topic.PostLike />
					<Topic.PostComment />
				</div>
			</div>
		)
	}
})

Topic.PostHeader = React.createClass({
	getDefaultProps: function(){
		return {
			avatar: './images/avater.jpg',
			userName: '天心',
			numBrowse: 9623,
			time: '08-25'
		}
	},
	render: function(){
		var avatar = this.props.avatar;
		return (
			<a className="user-info">
				<div className="user-avatar" style={{'backgroundImage': 'url(' + avatar + ')'}}></div>
				<div className="user-name">{this.props.userName}</div>
				<div className="top-info">
                    <div className="num-browse">9692</div>
                    <div className="time">08-25</div>
                </div>
			</a>
		)
	}
})

Topic.PostContent = React.createClass({
	getDefaultProps: function(){
		return {
			desc: '所有逃避你的时间，我都会后悔！',
			images: [
				'./images/avater.jpg',
				'./images/avater.jpg',
				'./images/avater.jpg'
			]
		}
	},
	render: function(){
		var images = this.props.images;
		return (
			<div>
				<p className="topic-desc">
	                <span className="text">
	                	听说各大景区现在都流行头上长草。跟我一样没有买旁友们也别着急！快使用我们的小草小花贴纸吧～
	                </span>
	            </p>
	            <div className="scroll-imgs">
	            	<ul className="clearfix">
	            		{images.map(function(item, index){
	            			return (
	            				<li key={index} className="user-img" style={{'backgroundImage': 'url(' + item + ')'}}></li>
	            			)
	            		})}
	            	</ul>
	            </div>
			</div>
		)
	}
})

Topic.PostLike = React.createClass({
	getDefaultProps: function(){
		return {
			likeCount: 123,
			likeFriends:[
				{uid:1, avatar: 'images/avater.jpg'},
				{uid:1, avatar: 'images/avater.jpg'},
				{uid:1, avatar: 'images/avater.jpg'},
				{uid:1, avatar: 'images/avater.jpg'},
				{uid:1, avatar: 'images/avater.jpg'},
				{uid:1, avatar: 'images/avater.jpg'},
				{uid:1, avatar: 'images/avater.jpg'}
			]
		}
	},
	render: function(){
		var friends = this.props.likeFriends;
		return (
			<div className="like-wrapper">
				<a href="#" className="btn-like">
                    <em className="icon"></em>
                    <span className="count">{this.props.likeCount}</span>     
                </a>
                <div className="like-friends">
                	{friends.map(function(item, index){
                		return (
                			<a key={index} className="user-avatar" style={{'backgroundImage': 'url(' + item.avatar + ')'}}></a>
                		)
                	})}
                	<a href="#" className="user-avatar ellipsis"></a>
                </div>
			</div>
		)
	}
})

Topic.PostComment = React.createClass({
	getDefaultProps: function(){
		return {
			comments: [
				{name: '天心', word: '你是什么样的人，取决于你做的决定！'},
				{name: '天心', word: '你是什么样的人，取决于你做的决定！'},
				{name: '天心', word: '你是什么样的人，取决于你做的决定！'},
				{name: '天心', word: '你是什么样的人，取决于你做的决定！'},
				{name: '天心', word: '你是什么样的人，取决于你做的决定！'}
			],
			numMore: 12
		}
	},
	render: function(){
		var comments = this.props.comments;
		return (
			<div>
				<div className="comment-list">
					{comments.map(function(item, index){
						return (
							<div key={index} className="comment-ele">
			                    <a href="#" className="name">{item.name}</a>
			                    <a href="#" className="text">{item.word}</a>
			                </div>
						)
					})}	
					<a className="more-comments-link" href="#">更多{this.props.numMore}条评论…</a>			
				</div>
				<a href="#" className="submit-comment-control">
	                <input type="text" placeholder="我也说一句..." />
	            </a>
            </div>
		)
	}
})

var bigImage = React.createClass({
	getDefaultProps: function(){
		return {
			"show": false,
			"images": []
		}
	},
	render: function(){
		return (
			<div className="preview" style={{'display': (this.props.show ? 'block' : 'none')}}>

			</div>
		)
	}
})


ReactDOM.render(<Topic/>, document.getElementById('app'), function (){
	console.log("渲染完成！");
});
