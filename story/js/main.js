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
				isSliderMode: false
			}
		},
		onChildChanged: function(newState){
			var newState = this.state[newState];
			this.setState({
				newState: newState
			})
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

					self.refs.slider.setValue(pLen);

					self.setState({
						pages: pages,
						pLen: pLen
					})
				}
			})
		},
		componentDidMount: function(){
			this.getPageData();
		},
		initBook: function(){
			var self = this;

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
		render: function(){
			var self = this;
			var ignore = false;
			var pages = [];
			var pLen = this.state.pLen;

			for(var i = 0; i< pLen; i++){
				pages.push(
					<Page key={i} />
				)
			}

			if(pLen){
				ignore = (pLen % 2) ? true : false;
				// 异步执行,在DOM渲染后执行
				setTimeout(function(){
					self.initBook();
				}, 0)
			}

			return (
				<div id='book' ref='book'>		
					<Guide />
					<Slider ref='slider'
							isSliderMode={this.props.isSliderMode}
							callbackParent={this.onChildChanged} />
					<FrontPage />					
					<div className='page hard'></div>
					<PrefacePage />

					{ pages }

					<MessagePage />
					<EndPage ignore={ignore} />

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
				// 翻动的次数：图片页数/2 + 底页(有余数) + 封面 + 封底 + 2
				num: 0,
				sliderW: 0,
				startX: 0,
				left: 1,
				lastPage: 1
			}
		},
		setValue: function(pLen){
			console.log(pLen)
			var num = Math.floor(pLen / 2) + pLen % 2 + 2 + 2
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

			var totalPage = ( num - 1) * 2;
			var pageNum = Math.ceil( left / sliderW * totalPage );
			
			if(lastPage != pageNum){
				lastPage = pageNum;			
				$('#book').turn('page', pageNum);

				// if(pageNum % 2){
				// 	(pageNum - 3 - 1 > pLen) ? $('.edit').hide() : $('.edit').show();
				// }else{						
				// 	(pageNum - 3 > pLen) ? $('.edit').hide() : $('.edit').show();
				// }

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

			var sliderW = $dom.bar.width() - $dom.btn.width();
			var left = parseInt( $dom.btn.css('transform').split(',')[4] );

			this.setState({
				isSliderMode: true,
				startX: e.touches[0].pageX,
				sliderW: sliderW,
				left: left
			})
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

			this.turnPage();
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
		render: function(){
			return (					
				<div className='page hard'></div>
			)
		}
	})

	var PrefacePage = React.createClass({
		render: function(){
			return (					
				<div className="page">
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
		componentDidMount: function(){
			if(this.props.ignore){
				$(this.refs.endPage).attr('ignore', '1');
			}
		},
		render: function(){
			return (					
				<div className="page" ref='endPage'>
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
		render: function(){
			return (
				<div className="page">

				</div>
			)
		}
	})

	ReactDOM.render(<Book/>, $('.wrapper')[0], function (){
		// console.log("渲染完成！");
	});



})