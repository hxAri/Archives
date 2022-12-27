	
	/*
	 * ChartJS
	 *
	 */
	const $Chart = {
		
		/*
		 * Various attractive colors.
		 *
		 * @source https://www.color-hex.com/color-palttes/popular.php
		 */
		colors: {
			androidLolipop: [
				"rgb( 131,208,201 )",
				"rgb( 101,195,186 )",
				"rgb( 84,178,169 )",
				"rgb( 53,167,156 )",
				"rgb( 0,150,136 )"
			],
			aesthetic: [
				"rgb( 102,84,94 )",
				"rgb( 163,145,147 )",
				"rgb( 170,111,115 )",
				"rgb( 238,169,144 )",
				"rgb( 246,224,181 )"
			],
			beautifulBlues: [
				"rgb( 179,205,224 )",
				"rgb( 100,151,177 )",
				"rgb( 0,91,150 )",
				"rgb( 3,57,108 )",
				"rgb( 1,31,75 )"
			],
			biegeLight: [
				"rgb( 250,240,230 )",
				"rgb( 255,240,219 )",
				"rgb( 238,217,196 )",
				"rgb( 238,217,196 )",
				"rgb( 217,185,155 )"
			],
			blueGrey: [
				"rgb( 110,127,128 )",
				"rgb( 83,104,114 )",
				"rgb( 112,128,144 )",
				"rgb( 83,104,120 )",
				"rgb( 54,69,79 )"
			],
			blues: [
				"rgb( 119,170,255 )",
				"rgb( 153,204,255 )",
				"rgb( 187,238,255 )",
				"rgb( 85,136,255 )",
				"rgb( 51,102,255 )"
			],
			caucasianSkinTone: [
				"rgb( 255,224,189 )",
				"rgb( 255,205,148 )",
				"rgb( 234,192,134 )",
				"rgb( 255,173,96 )",
				"rgb( 255,227,159 )"
			],
			coolBlue: [
				"rgb( 113,199,236 )",
				"rgb( 30,187,215 )",
				"rgb( 24,154,211 )",
				"rgb( 16,125,172 )",
				"rgb( 0,80,115 )"
			],
			discord: [
				"rgb( 114,137,218 )",
				"rgb( 66,69,73 )",
				"rgb( 54,57,62 )",
				"rgb( 40,43,48 )",
				"rgb( 30,33,36 )"
			],
			lilac: [
				"rgb( 230,215,255 )",
				"rgb( 231,209,255 )",
				"rgb( 225,196,255 )",
				"rgb( 216,185,255 )",
				"rgb( 210,175,255 )"
			],
			mutes: [
				"rgb( 46,64,69 )",
				"rgb( 131,173,181 )",
				"rgb( 199,187,201 )",
				"rgb( 94,60,88 )",
				"rgb( 191,181,178 )"
			],
			parrotGreen: [
				"rgb( 240,247,218 )",
				"rgb( 201,223,138 )",
				"rgb( 119,171,89 )",
				"rgb( 54,128,45 )",
				"rgb( 35,77,32 )"
			],
			pastelGreen: [
				"rgb( 232,244,234 )",
				"rgb( 224,240,227 )",
				"rgb( 210,231,214 )",
				"rgb( 200,225,204 )",
				"rgb( 184,216,190 )"
			],
			pastelPurple: [
				"rgb( 236,230,255 )",
				"rgb( 233,226,255 )",
				"rgb( 230,222,255 )",
				"rgb( 227,218,255 )",
				"rgb( 224,214,255 )"
			],
			princessPink: [
				"rgb( 255,194,205 )",
				"rgb( 255,147,172 )",
				"rgb( 255,98,137 )",
				"rgb( 252,52,104 )",
				"rgb( 255,8,74 )"
			],
			redOrange: [
				"rgb( 255,193,0 )",
				"rgb( 255,154,0 )",
				"rgb( 255,116,0 )",
				"rgb( 255,77,0 )",
				"rgb( 255,0,0 )"
			],
			sand: [
				"rgb( 246,215,176 )",
				"rgb( 242,210,169 )",
				"rgb( 236,204,162 )",
				"rgb( 231,196,150 )",
				"rgb( 225,191,146 )"
			],
			seventeen: [
				"rgb( 247,202,201 )",
				"rgb( 222,194,203 )",
				"rgb( 197,185,205 )",
				"rgb( 171,177,207 )",
				"rgb( 146,168,209 )"
			],
			shadesPurple: [
				"rgb( 239,187,255 )",
				"rgb( 216,150,255 )",
				"rgb( 190,41,236 )",
				"rgb( 128,0,128 )",
				"rgb( 102,0,102 )"
			],
			shadesRed: [
				"rgb( 255,186,186 )",
				"rgb( 255,123,123 )",
				"rgb( 255,82,82 )",
				"rgb( 255,0,0 )",
				"rgb( 167,0,0 )"
			],
			shadesTeal: [
				"rgb( 178,216,216 )",
				"rgb( 102,178,178 )",
				"rgb( 0,128,128 )",
				"rgb( 0,102,102 )",
				"rgb( 0,76,76 )"
			],
			shadesTurquoise: [
				"rgb( 179,236,236 )",
				"rgb( 137,236,218 )",
				"rgb( 67,232,216 )",
				"rgb( 64,224,208 )",
				"rgb( 59,214,198 )"
			],
			shadesWhite: [
				"rgb( 250,240,230 )",
				"rgb( 255,245,238 )",
				"rgb( 253,245,230 )",
				"rgb( 250,240,230 )",
				"rgb( 250,235,215 )"
			],
			softBlack: [
				"rgb( 65,74,76 )",
				"rgb( 59,68,75 )",
				"rgb( 53,56,57 )",
				"rgb( 35,43,43 )",
				"rgb( 14,17,17 )"
			],
			spaceGrey: [
				"rgb( 52,61,70 )",
				"rgb( 79,91,102 )",
				"rgb( 101,115,126 )",
				"rgb( 167,173,186 )",
				"rgb( 192,197,206 )"
			],
		},
		
		/*
		 * Default value for the plugins option.
		 *
		 * @return Object
		 */
		defaultPlugins: () => ({
			legend: {
				display: false
			},
			title: {
				display: false
			}
		}),
		
		/*
		 * A variety of interesting sample charts to use.
		 *
		 * @values Object
		 */
		samples: {
			
			/*
			 * Bar Chart
			 *
			 * @params Array $labels
			 * @params Array $datasets
			 * @params Object $options
			 *
			 * @return Object
			 */
			bar: function( labels, datasets, options )
			{
				// Check if chart has options given.
				if( is( options, Object ) )
				{
					return( $Chart.utils.fixableOptions( "bar", labels, datasets, options ) );
				}
				return({
					type: "bar",
					data: {
						labels: labels,
						datasets: $Chart.utils.fixableDatasets( datasets )
					},
					options: {
						responsive: true,
						plugins: $Chart.defaultPlugins()
					}
				});
			},
			
			/*
			 * Bubble Chart
			 *
			 * @params Array $labels
			 * @params Array $datasets
			 * @params Object $options
			 *
			 * @return Object
			 */
			bubble: function( labels, datasets, options )
			{
				// Check if chart has options given.
				if( is( options, Object ) )
				{
					return( $Chart.utils.fixableOptions( "bubble", labels, datasets, options ) );
				}
				return({
					type: "bubble",
					data: {
						labels: labels,
						datasets: $Chart.utils.fixableDatasets( datasets )
					},
					options: {
						aspectRatio: 1,
						responsive: true,
						plugins: {
							legend: false,
							toolip: false
						},
						elements: {
							point: {
								//backgroundColor: {},
								borderWidth: context => Math.min( Math.max( 1, context.datasetIndex + 1 ), 8 ),
								hoverBackgroundColor: "transparent",
								// hoverBorderColor: context => ,
								hoverBorderWidth: context => Math.round( 8 * context.raw.v / 1000 ),
								radius: context =>( context.chart.width / 24 ) * ( Math.abs( context.raw.v ) / 1000 )
							}
						}
					}
				});
			},
			
			/*
			 * Doughnut Chart
			 *
			 * @params Array $labels
			 * @params Array $datasets
			 * @params Object $options
			 *
			 * @return Object
			 */
			doughnut: function( labels, datasets, options )
			{
				// Check if chart has options given.
				if( is( options, Object ) )
				{
					return( $Chart.utils.fixableOptions( "doughnut", labels, datasets, options ) );
				}
				return({
					type: "doughnut",
					data: {
						labels: labels,
						datasets: $Chart.utils.fixableDatasets( datasets )
					},
					options: {
						responsive: true,
						plugins: $Chart.defaultPlugins()
					}
				});
			},
			
			/*
			 * Line Chart
			 *
			 * @params Array $labels
			 * @params Array $datasets
			 * @params Object $options
			 *
			 * @return Object
			 */
			line: function( labels, datasets, options )
			{
				// Check if chart has options given.
				if( is( options, Object ) )
				{
					return( $Chart.utils.fixableOptions( "line", labels, datasets, options ) );
				}
				// ...
			},
			
			/*
			 * Pie Chart
			 *
			 * @params Array $labels
			 * @params Array $datasets
			 * @params Object $options
			 *
			 * @return Object
			 */
			pie: function( labels, datasets, options )
			{
				// Get from doughnut chart.
				var pie = $Chart.samples.doughnut( labels, datasets, options );
				
				// Change chart type from doughnut to pie.
				pie.type = "pie";
				
				// Return configs.
				return( pie );
			},
			
			/*
			 * Polar Area Chart
			 *
			 * @params Array $label
			 * @params Array $dataset
			 * @params Object $options
			 *
			 * @return Object
			 */
			polar: function( labels, datasets, options )
			{
				// Check if chart has options given.
				if( is( options, Object ) )
				{
					return( $Chart.utils.fixableOptions( "polar", labels, datasets, options ) );
				}
				// ...
			},
			
			/*
			 * Radar Chart
			 *
			 * @params Array $labels
			 * @params Array $datasets
			 * @params Object $options
			 *
			 * @return Object
			 */
			radar: function( labels, datasets, options )
			{
				// Check if chart has options given.
				if( is( options, Object ) )
				{
					return( $Chart.utils.fixableOptions( "radar", labels, datasets, options ) );
				}
				// ...
			}
		},
		
		/*
		 * Chart Utilities
		 *
		 */
		utils: {
			
			/*
			 * Channel value.
			 *
			 * @params Number $x
			 * @params Number $y
			 * @params Array $values
			 *
			 * @return ?
			 */
			channelValue: ( x, y, values ) => x < 0 && y < 0 ? values[0] : x < 0 ? values[1] : y < 0 ? values[2] : values[3],
			
			/*
			 * Colorize.
			 *
			 * @params Number $opaque
			 * @params Object $context
			 *
			 * @return ?
			 */
			colorize: function( opaque, context )
			{
				const x = context.raw.x / 100;
				const y = context.raw.y / 100;
				
				// Return RGBA color format.
				return( f( "rgba( {}, {}, {}, {} )", ...[
					
					// Red
					$Chart.utils.channelValue( x, y, [ 250, 150, 50, 0 ] ),
					
					// Green Color
					$Chart.utils.channelValue( x, y, [ 0, 50, 150, 250 ] ),
					
					// Blue Color
					$Chart.utils.channelValue( x, y, [ 0, 150, 150, 250 ] ),
					
					// Aplha Color
					opaque ? 1 : 0.5 * context.raw.v / 1000
				]));
			},
			
			/*
			 * Normalize dataset values.
			 *
			 * @params Array $datasets
			 *
			 * @return Array
			 */
			fixableDatasets: function( datasets )
			{
				// Return mapping datasets.
				return(
					not( datasets, Array, [], () => $Mapper( datasets, ( index, value ) =>
					{
						// Check if dataset doest not have data.
						if( not( value.data, Array ) )
						{
							// Create data.
							value.data = [];
						}
						
						// Check if dataset has background color.
						if( not( value.backgroundColor, "Undefined" ) )
						{
							// If background color is Boolean type.
							if( is( value.backgroundColor, Boolean ) )
							{
								// If background color is allow for random color.
								if( value.backgroundColor === true )
								{
									value.backgroundColor = $Choice( $Chart.colors );
								}
								else {
									delete value.backgroundColor;
								}
							}
							
							// Check if background color is String type.
							// And if color given exists.
							if( is( value.backgroundColor, String ) &&
								is( $Chart.colors[value.backgroundColor], Array ) )
							{
								value.backgroundColor = $Chart.colors[value.backgroundColor];
							}
						}
						
						// Return dataset.
						return( value );
					}))
				);
			},
			
			/*
			 * Normalize option values.
			 *
			 * @params String $type
			 * @params Array $labels
			 * @params Array $datasets
			 * @params Object $options
			 *
			 * @return Object
			 */
			fixableOptions: function( type, labels, datasets, options )
			{
				// Get chart sample configs.
				var configs = $Chart.samples[type]( labels, datasets );
				
				// Mapping chart options given.
				$Mapper( options, ( index, key, value ) => configs.options[key] = value );
				
				// Return chart configs.
				return( configs );
			}
		}
	};
	
	/*
	 * Chart Component.
	 *
	 * @options Object $configs
	 */
	const $ChartComponent = {
		
		/*
		 * Component data.
		 *
		 * @return Object
		 */
		data: () => ({
			instance: null
		}),
		
		/*
		 * Component props.
		 *
		 * @values Object
		 */
		props: {
			type: {
				type: String,
				required: true
			},
			labels: {
				type: Array,
				required: true
			},
			datasets: {
				type: Array,
				required: true
			},
			options: {
				type: Array
			}
		},
		
		/*
		 * Component mount.
		 *
		 * @return Void
		 */
		mounted: function()
		{
			// Create chart display.
			this.instance = new Chart(
				this.$refs,
				$Chart.samples[this.type](
					this.labels,
					this.datasets,
					this.options
				)
			);
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="chart">
				<canvas class="chart-canvas" ref="canvas"></canvas>
			</div>`
	};
	