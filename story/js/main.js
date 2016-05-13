$(function(){
	$(window).on('resize', function(){
		$('html').css('fontSize', $(window).width() / 64);
	})

	function init(){

	}

	var Book = React.createClass({
		getInitialState: function(){
			return {
				story: {},
				pages: {},
				pLen: 0,
				isSliderMode: false,
				fontSize: 0,
				isInit:false
			}
		},	
		setValue: function(key, value){
			var obj = {}
			obj[key] = value;
			this.setState(obj);
		},
		getPageData: function(){
			var self = this;
			var url = './js/data.json';
			var pLen = 0;
			$.ajax({
				url: url
			}).done(function(res){
				var story, pages;
				if(res.data && res.data.story){
					story = res.data.story;

					self.setState({
						story: story
					})
				}

				if(res.data && res.data.group){
					pages = res.data.group;
					pLen = pages.length;

					self.refs.slider.setValue('num', pLen);

					self.setState({
						pages: pages,
						pLen: pLen
					})
				}
			})
		},
		componentDidMount: function(){
			this.getPageData();
			var fontSize = this.getHeight() / 300;
			this.refs.FrontPage.setValue('fontSize', fontSize);		
			this.refs.PrefacePage.setValue('fontSize', fontSize);		
			this.refs.EndPage.setValue('fontSize', fontSize);	
		},
		initBook: function(){
			var self = this;

			if(self.state.isInit) return;
			self.setState({
				isInit: true
			})

			var $book = $( this.refs.book );
			var h = self.getHeight();

			$book.turn({
				width: h * 2,
				height: h,
				acceletration: true,
				gradients: true,
				when: {
					turning: function(e, page, pageObj){
						var val = Math.ceil(page / 2);
						if(page % 2){
							val--;
						}

						// 解除滑块联动，避免touchmove的时候冲突使位置偏移
						if(!self.state.isSliderMode){
							// 翻动的次数：图片页数/2 + (封面 + 封底) + 1 + 奇数加一偶数加0;
							var pLen = self.state.pLen;
							var num = Math.floor(pLen / 2) + 2 + 1 + pLen % 2;
							var left = Math.floor(val / num * ( $('#slider').width() - $('#slider .btn').width() ) );

							$('#slider .btn').css({
								'-webkit-transform': 'translate(' + left + 'px, -50%)',
								'transform': 'translate(' + left + 'px, -50%)'
							});
						}
					}
				}
			})
		},
		getHeight: function(){
			var winScale = $(window).width() / $(window).height();
			var bookHeight;
			if(winScale > 2){
				bookHeight = $(window).height() * (1 - $(window).width()*0.015*2 / $(window).height() );
			}else{
				bookHeight = $(window).width() * (1 - 0.015*2) / 2;
			}

			return bookHeight;
		},
		resizeHeight: function(){
			var $book = $( this.refs.book );
			var h = this.getHeight();

			$book.turn('size', h * 2, h);
		},
		afterRender: function(pLen){
			var self = this;
			var ignore = false;
			if(pLen){
				ignore = (pLen % 2) ? true : false;

				// 异步执行,在DOM渲染后执行
				var fontSize = this.getHeight() / 300;
				setTimeout(function(){
					for(var j = 0; j < pLen; j++){
						var key = 'Page-'+j;
						self.refs[key].setValue('fontSize', fontSize);
					}

					self.refs.EndPage.setValue('ignore', ignore);
					self.initBook();
				}, 0)
			}
		},
		render: function(){
			var pages = [];
			var pLen = this.state.pLen;

			for(var i = 0; i< pLen; i++){
				pages.push(
					<Page key={i} ref={'Page-'+i}/>
				)
			}

			this.afterRender(pLen);

			return (
				<div id='book' ref='book'>		
					<Guide />
					<Slider ref='slider'
							isSliderMode={this.props.isSliderMode}
							setValue={this.setValue} />
					<FrontPage ref='FrontPage' />					
					<div className='page hard'></div>
					<PrefacePage ref='PrefacePage' />
					{ pages }
					<MessagePage />
					<EndPage ref='EndPage' />
					<div className='page hard'></div>
					<BackCover />
				</div>
			)
		}
	})

	var Guide = React.createClass({
		componentDidMount: function(){			
			var $guide = $( this.refs.guide );
			$guide.attr('ignore', '1');
		},
		render:function(){
			return (
				<div className="guide" ref='guide'>
					<div className="box">
						<div className="figure"></div>
					</div>
					<div className="box">
						<div className="text">	
							<p className="red">恭喜您制作完成啦！</p>
							<p>赶紧去打印吧</p>
						</div>
						<a href="javascript:;">
							<div className="red btn-printer">
								<span className="icon-printer"></span>
								<span>立即打印</span>
							</div>
						</a>
					</div>
				</div>
			)
		}
	})

	var Slider = React.createClass({
		getInitialState: function(){
			return {
				isSliderMode: this.props.isSliderMode,
				num: 0,
				sliderW: 1,
				startX: 0,
				left: 1,
				lastPage: 1
			}
		},
		setValue: function(key, value){
			var obj = {}
			obj[key] = value;
			this.setState(obj);

			if(key == 'num'){
				this.setNum(value);
			}
		},
		setNum: function(value){
			// 翻动的次数：图片页数/2 + (封面 + 封底) + 1 + 奇数加一偶数加0;
			var num = Math.floor(value / 2) + 2 + 1 + value % 2;
			this.setState({
				num: num
			})
		},
		$dom: {},
		componentDidMount: function(){
			var bar = $( this.refs.bar );
			var btn = $( this.refs.btn );
			var num = $( this.refs.num );
			var bigBtn = $( this.refs.bigBtn );
			var slider = $( this.refs.slider );

			btn.css({'transform': 'translate(1px, -50%)'});
			slider.attr('ignore', '1');			

			var sliderW = bar.width() - btn.width();
			this.setState({
				sliderW: sliderW
			})

			this.$dom = {
			    bar: $( this.refs.bar ),
			    btn: $( this.refs.btn ),
			    num: $( this.refs.num ),
			    bigBtn: $( this.refs.bigBtn ),
			    slider: $( this.refs.slider )
			};
		},
		getPageNumber: function(){
			var numArr = $('#book').turn('view');
			if(numArr[0] == 0 || numArr[1] == 0){
				return numArr[0] + numArr[1];
			}else{
				return numArr.join('-');
			}
		},
		turnPage: function(){
			var $dom = this.$dom;
			var left = this.state.left;
			var sliderW = this.state.sliderW;
			var lastPage = this.state.lastPage;
			var num = this.state.num;
			var pLen = this.props.pLen;

			var totalPage = num * 2;
			var pageNum = Math.ceil( left / sliderW * totalPage );
			
			if(lastPage != pageNum){
				lastPage = pageNum;		
				$('#book').turn('page', pageNum);

				$dom.num.text(this.getPageNumber());
			}

			this.setState({
				lastPage: lastPage
			})
		},
		touchStart: function(e){

			var $dom = this.$dom;
			$dom.num.text(this.getPageNumber());
			$dom.slider.addClass('active');

			var left = parseInt( $dom.btn.css('transform').split(',')[4] );

			this.props.setValue('isSliderMode', true);
			this.setState({
				isSliderMode: true,
				startX: e.touches[0].pageX,
				left: left
			});
		},
		touchMove: function(e){
			var $btn = this.$dom.btn;
			var startX = this.state.startX;
			var left = this.state.left;
			var sliderW  = this.state.sliderW;

			var moveX, moveY, dx, dy;
			moveX = e.touches[0].pageX;

			dx = moveX - startX;
			left += dx;

			if(left > sliderW){
				left = sliderW;
			}

			if(left <= 0){
				left = 1;
			}

			startX = moveX;

			$btn.css({
				'-webkit-transform': 'translate(' + left + 'px, -50%)',
				'transform': 'translate(' + left + 'px, -50%)'
			});

			this.turnPage();

			this.props.setValue('isSliderMode', true);
			this.setState({
				isSliderMode: true,
				startX: startX,
				left: left
			})
		},
		touchEnd: function(e){
			this.setState({
				isSliderMode: true
			})

			// this.turnPage();
			this.$dom.slider.removeClass('active');
		},
		render: function(){
			return (
				<div className="slider" ref='slider'>
					<div id="slider" ref='bar'>
						<div className="btn" ref='btn'>
							<div className="number" ref='num'></div>
							<div ref='bigBtn' className="btn-big" 
								onTouchStart={this.touchStart}
								onTouchMove={this.touchMove}
								onTouchEnd={this.touchEnd}></div>
						</div>
					</div>
				</div>
			)
		}
	})

	var FrontPage = React.createClass({
		getInitialState: function(){
			return {
				fontSize:0
			}
		},
		setValue: function(key, value){
			var obj = {}
			obj[key] = value;
			this.setState(obj);
		},
		render: function(){
			return (					
				<div className='page hard' style={{'fontSize': this.state.fontSize}}></div>
			)
		}
	})

	var PrefacePage = React.createClass({
		getInitialState: function(){
			return {
				fontSize:0
			}
		},
		setValue: function(key, value){
			var obj = {}
			obj[key] = value;
			this.setState(obj);
		},
		render: function(){
			return (					
				<div className="page" style={{'fontSize': this.state.fontSize}}>
					<div className="preface">
						<div className="title">/ <span id="prefacetitle">Hello, React!</span></div>
						<div id="prefacedesc" className="desc">This is a demo for story!</div>
					</div>
				</div>
			)
		}
	})

	var MessagePage = React.createClass({
		render: function(){
			return (					
				<div className="page msg">
					<div className="bg"></div>
					<div className="qr"></div>
				</div>
			)
		}
	})

	var EndPage = React.createClass({
		getInitialState: function(){
			return {
				fontSize:0
			}
		},
		setValue: function(key, value){
			var obj = {};
			obj[key] = value;
			this.setState(obj);
		},
		render: function(){
			var style;
			if(this.props.ignore){
				$(this.refs.endPage).attr('ignore', '1');
				style = {
					'display': 'none'
				}
			}else{
				style = {
					'fontSize': this.state.fontSize,
				}

			}

			return (					
				<div className="page" ref='endPage' style={style}>
					<p className="end">-&nbsp;THE END&nbsp;-</p>
				</div>
			)
		}
	})

	var BackCover = React.createClass({
		render: function(){
			return (					
				<div className='page hard'></div>
			)
		}
	})

	var Page = React.createClass({
		getInitialState: function(){
			return {
				fontSize:0
			}
		},
		setValue: function(key, value){
			var obj = {};
			obj[key] = value;
			this.setState(obj);
		},
		render: function(){
			return (
				<div className="page" style={{'fontSize': this.state.fontSize}}></div>
			)
		}
	})

	ReactDOM.render(<Book/>, $('.wrapper')[0], function (){
		// console.log("渲染完成！");
	});



})