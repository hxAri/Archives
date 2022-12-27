
/*
 * GGardenJS
 *
 * @author Ari Setiawan
 * @author Alvin Arif Pirmansyah
 * @auhtor Wahyu Fahreza
 * @auhtor Indri Rani Saputri
 * @author Rizki Solehah
 *
 * @helper Falsa Fadilah Nugraha
 * 
 * @create 22.10-2-2022
 * @update -
 * @finish -
 */
	
	/*
	 * Create Articel Component.
	 *
	 */
	const $CreateComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			images: [],
			models: {
				name: {
					common: {
						error: false,
						value: null
					},
					latin: {
						error: false,
						value: null
					},
				},
				type: {
					error: false,
					value: "46-6c-6f-77-65-72",
					default: "46-6c-6f-77-65-72"
				},
				description: {
					error: false,
					value: null
				},
				scientific: {
					error: false,
					value: null
				},
				original: {
					error: false,
					value: null
				},
				utility: {
					error: false,
					value: null
				}
			},
			error: false,
			onpost: false,
			shared: null
		}),
		
		/*
		 * Component mount.
		 *
		 * @values Function
		 */
		mounted: function()
		{
			if( this.auth() )
			{
				this.shared = $data.shared.profile;
			}
		},
		
		/*
		 * Component methods.
		 *
		 * @values Function
		 */
		methods: {
			
			/*
			 * Check if user has Authenticated.
			 *
			 * @return Boolean
			 */
			auth: function()
			{
				return( $Authenticated() );
			},
			
			/*
			 * Handle onchange file.
			 *
			 * @params Event $e
			 *
			 * @return Void
			 */
			onChangeFile: function( e )
			{
				// Copy object instance.
				var self = this;
				
				// If there are pictures added.
				if( e.target.files.length > 0 )
				{
					// Mapping pictures added.
					for( let i in e.target.files )
					{
						if( e.target.files[i] )
						{
							try
							{
								self.images.push({
									file: e.target.files[i],
									src: URL.createObjectURL( e.target.files[i] )
								});
							}
							catch( e )
							{}
						}
					}
				}
			},
			
			/*
			 * Avatar normalize.
			 *
			 * @params String $image
			 *
			 * @return Object
			 */
			onDisplayFile: function( image )
			{
				return({
					inject: {
						avatar: "create-avatar",
						wrapper: "create-avatar-wrapper"
					},
					slot: {
						template: `
							<button class="" @click="$emit( 'rmf' )">
								<i class="bx bx-x"></i>
							</button>
						`
					},
					src: image
				});
			},
			
			/*
			 * Handle onremove file 
			 *
			 * @params Number $index
			 *
			 * @return Void
			 */
			onRemoveFile: function( index )
			{
				// Delete image by index.
				delete this.images[index];
				
				// New image entries.
				var images = [];
				
				// Mapping images.
				for( let i in this.images )
				{
					if( this.images[i] )
					{
						images.push( this.images[i] );
					}
				}
				
				// Change images values.
				this.images = images;
			},
			
			/*
			 * Handle on post articel.
			 *
			 * @return Promise
			 */
			onUploadPost: async function()
			{
				// Copy object instance.
				var self = this;
				
				// Create Form Data.
				var data = new FormData();
				
				// Mapping files.
				for( let i = 0; i < this.images.length; i++ )
				{
					data.append(
						this.images[i].file.name,
						this.images[i].file
					);
				}
				
				// Error default value.
				var error = false;
				
				// Mapping inputs.
				$Mapper( self.models, ( idx, key, model ) =>
				{
					// If input is name.
					if( key === "name" )
					{
						// Mapping names.
						$Mapper( model, ( idx, key, model ) =>
						{
							// Check if something wrong.
							if( model.error === false && error === false )
							{
								// Disable error.
								error = false;
							}
							else {
								error = true;
							}
							
							// Append data.
							data.append( key, model.value );
						});
					}
					else {
						
						// Check if something wrong.
						if( model.error === false && error === false )
						{
							// Disable error.
							error = false;
						}
						else {
							error = true;
						}
						
						// Append data.
						data.append( key, model.value );
					}
				});
				
				// Check if no error.
				if( error === false )
				{
					// On post loading start.
					self.onpost = true;
					
					// Send post.
					await $Request( "POST", "/api/plant/post", {
						data: data
					})
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Check if request response on error.
						if( resp.error )
						{
							// Send error to console.
							self.error = resp.message;
						}
						else {
							
							// Reset forms.
							self.reset();
							
							// Route push.
							$Router.push({
								path: f( "/p/{}", resp.data.node ),
								query: {
									feature: "post"
								}
							});
						}
					})
					
					// Handle request onerror.
					.catch( err => $Request.onError( self, error ) );
					
					// Disable onpost loading.
					self.onpost = false;
				}
			},
			
			/*
			 * Reset form.
			 *
			 * @return Void
			 */
			reset: function()
			{
				// Remove images.
				this.images = [];
				
				// Reset models.
				this.models = {
					name: {
						common: {
							error: false,
							value: null
						},
						latin: {
							error: false,
							value: null
						},
					},
					type: {
						error: false,
						value: "46-6c-6f-77-65-72",
						default: "46-6c-6f-77-65-72"
					},
					description: {
						error: false,
						value: null
					},
					scientific: {
						error: false,
						value: null
					},
					original: {
						error: false,
						value: null
					},
					utility: {
						error: false,
						value: null
					}
				};
			}
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="create">
				<div class="create-wrapper flex flex-center" v-if="auth()">
					<div class="create-section flex flex-center">
						<div class="create-galery dp-grid">
							<div class="create-ibox flex flex-center">
								<div class="create-ibox-block">
									<div class="create-ibox-wrapp flex flex-center">
										<i class="bx bxs-camera ic-3"></i>
										<input class="form-file" type="file" accept="image/png, image/jpeg" ref="file" @change="onChangeFile" multiple />
									</div>
									<p class="mg-0 flex flex-center">
										<span class="fb-45 fc-1">{{ images.length }}</span> Selected
									</p>
								</div>
							</div>
							<Avatar :options="onDisplayFile( image.src )" v-for="( image, idx ) in images" v-if="images.length > 0" @rmf="onRemoveFile( idx )" />
						</div>
					</div>
					<div class="create-section">
						<div class="create-block form pd-14">
							<div class="form-group">
								<label class="form-label fc-1" for="common">Common Name Plant</label>
								<input class="form-input pd-10" v-model="models.name.common.value" placeholder="e.g Onion" />
							</div>
							<div class="form-group">
								<label class="form-label fc-1" for="latin">Latin Name Plant</label>
								<input class="form-input pd-10" v-model="models.name.latin.value" placeholder="e.g Allium cepa" />
							</div>
							<div class="form-group">
								<label class="form-label fc-1" for="description">Description of Plant</label>
								<textarea class="form-input pd-10" v-model="models.description.value" placeholder="e.g Onion is..."></textarea>
							</div>
							<div class="form-group">
								<label class="form-label fc-1" for="scientific">Scientific of Plant</label>
								<textarea class="form-input pd-10" v-model="models.scientific.value" placeholder="e.g kingdom=Plantae; clades=Tracheophytes, Angiosp..."></textarea>
							</div>
							<div class="form-group">
								<label class="form-label fc-1" for="original">Origin of Plant</label>
								<textarea class="form-input pd-10" v-model="models.original.value" placeholder="e.g Onion is a vegetable from..."></textarea>
							</div>
							<div class="form-group">
								<label class="form-label fc-1" for="utility">Utility of Plant</label>
								<textarea class="form-input pd-10" v-model="models.utility.value" placeholder="e.g Onion is usage for..."></textarea>
							</div>
							<div class="form-group">
								<label class="form-label fc-1" for="type">Type Plant</label>
								<select class="form-input form-select pd-top-10 pd-right-10 pd-bottom-10 pd-left-8" v-model="models.type.value">
									<option value="46-6c-6f-77-65-72" select>Flower</option>
									<option value="46-72-75-69-74">Fruit</option>
									<option value="50-6c-61-6e-74">Plant</option>
									<option value="52-6f-6f-74">Root</option>
									<option value="54-72-65-65">Tree</option>
									<option value="56-65-67-65-74-61-62-6c-65">Vegetable</option>
								</select>
							</div>
							<button class="form-submit button button-an rd-square flex flex-center" @click="onUploadPost">
								Post <i class="bx bx-cloud-upload bx-flashing fc-an-3 fs-18" v-if="onpost"></i>
							</button>
							{{ error }}
						</div>
					</div>
				</div>
				<div class="" v-else>
					You Must Login!
				</div>
			</div>
		`
	};
	
	/*
	 * About Component.
	 *
	 */
	const $AboutComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
		}),
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="about">
				<div class="about-banner">
				</div>
				<div class="about-descriptions">
				</div>
			</div>
		`
	};
	
	/*
	 * Home Component.
	 *
	 */
	const $HomeComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			shared: {},
			signed: false,
			levels: $Levels,
			banner: {
				inject: {
					avatar: "home-banner-avatar",
					cover: [
						"home-banner-avatar-cover",
						"flex flex-center"
					],
					wrapper: "home-banner-avatar-wrapper"
				},
				slot: `
					<div class="home-banner-center">
						<div class="home-banner-block">
							<h1 class="home-banner-title">Welcome To Green Garden</h1>
							<p class="home-banner-text">
								Green Garden is a web that focuses on plantations, such as flowers, fruits and so on.
							</p>
							<p class="home-banner-text">
								Join other users to post interesting articles about plantations.
							</p>
							<router-link to="/signup">
								<button class="button button-kw fb-45 flex flex-center pd-14">
									Signup
								</button>
							</router-link>
						</div>
					</div>
				`,
				src: "/assets/images/banner/banner-GQVc6LKAzzQ.jpg"
			}
		}),
		
		/*
		 * Component mount.
		 *
		 * @return Promise
		 */
		mounted: async function()
		{
			// Check if user has authenticated.
			if( $Authenticated() )
			{
				this.shared = $data.shared;
				this.signed = true;
			}
		},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			
			/*
			 * Check if level is Super Admin.
			 *
			 * @params String $level
			 * 
			 * @return Boolean
			 */
			isSuperAdmin: function( level )
			{
				return( this.levels.superAdmin === level );
			},
			
			/*
			 * Check if level is Admin.
			 *
			 * @params String $level
			 * 
			 * @return Boolean
			 */
			isAdmin: function( level )
			{
				return( this.levels.admin === level || this.isSuperAdmin( level ) );
			},
			
			/*
			 * Check if level is User.
			 *
			 * @params String $level
			 * 
			 * @return Boolean
			 */
			isUser: function( level )
			{
				return( this.levels.user === level );
			}
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent,
			Admin: $AdminHomeComponent,
			Timeline: $TimelineComponent
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="home">
				<div class="home-timeline" v-if="( shared && signed )">
					<Admin :shared="shared" v-if="isAdmin( shared.profile.account )" />
					<Timeline :shared="shared" v-else />
				</div>
				<div class="home-banner" v-else>
					<Avatar :options="banner" />
				</div>
			</div>
		`
	};
	
	/*
	 * Plant Component.
	 *
	 */
	const $PlantComponentx = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			author: false,
			error: false,
			plant: null,
			loading: true,
			response: null
		}),
		
		/*
		 * Component props.
		 *
		 * @values Object
		 */
		props: {
			passed: Object
		},
		
		/*
		 * Component mount.
		 *
		 * @return Promise
		 */
		mounted: async function()
		{
			// Copy object instance.
			var self = this;
				
				// Allow loading animation.
				self.loading = true;
			
			// Check if component has props.
			if( is( self.passed, Object ) )
			{
				self.plant = self.passed;
			}
			
			// Check if articel is not Object type.
			else if( not( self.plant = $data.shared.articels, Object ) )
			{
				// Get resources.
				await $Request( "GET", f( "/api/plant/{}", self.$route.params.node ) )
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Save response.
						self.response = resp;
						
						// Check if request response on error.
						if( resp.error )
						{
							// Save error message.
							self.error = resp.message;
						}
						else {
							self.plant = resp.data;
						}
					})
					
					// Handle request error.
					.catch( err => $Request.onError( self, err ) );
			}
			
			// Check if no error.
			if( self.error === false )
			{
				// Create plant avatar.
				self.plant.avatar = {
					inject: {
						avatar: [
							"post-avatar",
							"rd-square"
						],
						wrapper: [
							"post-avatar-wrapper"
						]
					},
					route: f( "/p/{}?feature=plant", self.plant.node ),
					title: self.plant.name.common,
					alt: self.plant.name.latin,
					src: self.plant.images.banner
				};
			}
			
			// Disable loading animation.
			self.loading = false;
		},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			
			/*
			 * Avatar normalizer.
			 *
			 * @params Object $image
			 * 
			 * @return Object
			 */
			galery: function( image )
			{
				return({
					inject: {
						avatar: [
							"post-galery-avatar",
							"flex",
							"flex-center"
						],
						wrapper: [
							"post-galery-avatar-wrapper"
						]
					},
					title: this.plant.name.common,
					alt: this.plant.name.latin,
					src: image
				});
			}
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent,
			Error: $Error
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="post">
				<div class="post-loading" v-if="( loading )">
					<div class="animate-loading flex flex-center pd-24">
						<div class="animate">
							<div class="spinner"></div>
						</div>
					</div>
				</div>
				<div class="post-error" v-else-if="( error )">
					<Error>
						{{ error }}
					</Error>
				</div>
				<div class="post-result flex flex-center" v-else>
					<div class="post-found rd-square" v-if="( plant )">
						<div class="post-header pd-14 flex flex-left">
							<i class="bx bx-dots-horizontal-rounded fs-26"></i>
						</div>
						<div class="post-content flex flex-left rd-square">
							<div class="post-banner scroll-hidden">
								<div class="post-galery flex flex-center scroll-hidden">
									<div class="post-galery-scroll scroll-hidden">
										<Avatar :options="galery( plant.images.banner )" />
										<Avatar :options="galery( image )" v-for="image in plant.images.common" />
									</div>
								</div>
								<div class="post-view">
									<div class="post-view-rel flex">
										<button class="post-view-button button star pd-10 fs-18 flex flex-center">
											<i class="post-view-button-ic bx bxs-star mg-right-6 fs-20"></i>
											<span class="post-view-button-tt">1k</span>
										</button>
										<button class="post-view-button button show pd-10 fs-18 flex flex-center">
											<i class="post-view-button-ic bx bxs-show mg-right-6 fs-20"></i>
											<span class="post-view-button-tt">75.2k</span>
										</button>
										<button class="post-view-button button bookmark pd-10 fs-18 flex flex-center">
											<i class="post-view-button-ic bx bxs-bookmark fs-20"></i>
										</button>
									</div>
								</div>
							</div>
							<div class="post-info scroll-hidden">
								<div class="pd-14">
									<h5 class="post-name-common fb-45 fc-1 mg-0">{{ plant.name.common }}</h5>
									<p class="post-name-latin fb-35 fs-16 mg-bottom-10">
										<router-link class="fc-2" :to="{ path: '/p/' + plant.node }">
											{{ plant.name.latin }}
										</router-link>
									</p>
									<div class="mg-bottom-14">
										<li class="post-description mg-bottom-14 mg-lc-bottom li-type-none" v-for="description in plant.description">
											{{ description }}
										</li>
									</div>
									<h5 class="post- fb-45">Origin of {{ plant.name.common }}</h5>
									<p class="post-description mg-bottom-14 li-type-none">
										{{ plant.original }}
									</p>
									<div class="post-utility mg-bottom-14" v-if="( plant.utility )">
										<h5 class="post-">Utility of {{ plant.name.common }}</h5>
										<li class="post-utility-text post-description mg-bottom-14 mg-lc-bottom li-type-none" v-if="( plant.utility.text )" v-for="text in plant.utility.text">{{ text }}</li>
										<li class="post-utility-text post-description mg-bottom-14 mg-lc-bottom" v-if="( plant.utility.list )" v-for="util in plant.utility.list">{{ util }}</li>
									</div>
									<div class="post-scientific" v-if="( plant.scientific )">
										<h5 class="post-">Scientific of {{ plant.name.common }}</h5>
										<table class="table collapse">
											<tr class="table-row" v-for="( value, name ) in plant.scientific">
												<td class="table-data">{{ name }}</td>
												<td class="table-data" v-if="( name === 'clades' && value.length !== 0 )">
													<p class="data" v-for="clade in value">
														{{ clade }}
													</p>
												</td>
												<td class="table-data" v-else>{{ value ? value : "None" }}</td>
											</tr>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="post-none" v-else>
						Page Not Found!
					</div>
				</div>
			</div>
		`
	};
	