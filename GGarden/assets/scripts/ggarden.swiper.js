	
	/*
	 * SwiperJS
	 *
	 */
	const $Swiper = {};
	
	/*
	 * Swiper Component.
	 *
	 * @options Object $configs
	 */
	const $SwiperComponent = {
		
		/*
		 * Component properties.
		 *
		 * @return Object
		 */
		data: () => ({
			swiper: null
		}),
		
		/*
		 * Component props.
		 *
		 * @values Object
		 */
		props: {
			configs: {
				type: Object
			}
		},
		
		/*
		 * Component mount.
		 *
		 * @return Void
		 */
		mounted: function()
		{
			// ...
			// this.$parent.$refs
			
			this.swiper = new Swiper( this.$refs.swiper, this.configs );
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="swiper" ref="swiper">
				<div class="swiper-wrapper">
					<slot name="default"></slot>
				</div>
				<slot name="navigation"></slot>
				<slot name="pagination"></slot>
			</div>
		`
	};
	
	/*
	 * Swiper Slide Component.
	 *
	 */
	const $SwiperSlideComponent = {
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="swiper-slide">
				<slot name="default"></slot>
			</div>
		`
	};
	