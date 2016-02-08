class Api::ToolListsController < ApplicationController

	before_action :set_tool_list, only: [:update, :destroy]

	def index

		params[:page] ||= 1;
		per_page = 10;

		params[:is_editor] = params[:is_editor].to_boolean
		params[:is_follower] = params[:is_follower].to_boolean
		if params[:is_editor] and params[:is_follower]						
			@tool_lists = ToolList.joins(:tool_list_user_roles).where('tool_lists.is_hidden = ? AND tool_lists.user_id = ? AND tool_list_user_roles.is_editor = ? AND tool_list_user_roles.is_follower = ?', false, current_user[:id], params[:is_editor], params[:is_follower])
		elsif params[:is_editor] or params[:is_follower]					
			@tool_lists = ToolList.joins(:tool_list_user_roles).where('tool_lists.is_hidden = ? AND tool_lists.user_id = ? AND (tool_list_user_roles.is_editor = ? OR tool_list_user_roles.is_follower = ?)', false, current_user[:id], params[:is_editor], params[:is_follower])
		else
			if current_user && current_user.is_admin?				
				@tool_lists = ToolList.where(is_hidden: false)
			else				
				@tool_lists = ToolList.where('is_public = ? AND is_hidden = ?', true, false);
			end
		end			

		respond_to do |format|			
			# format.json {render json: @tool_lists}
			format.json {render json: @tool_lists.limit(per_page).offset((params[:page].to_i - 1) * per_page), root: "tool_lists", meta: {count: @tool_lists.length}, status: :ok}
		end
	end

	def show 
		respond_to do |format|
			tool_list = ToolList.find(params[:id]);
			if not tool_list.is_hidden
			# format.json { render json: @tool, include_comments: params[:include_comments] }			
				format.json { render json: tool_list, status: :ok}			
			else
				format.json {{status: :unauthorized}}			
			end
		end
	end
	
	def by_curator
		respond_to do |format|
			result = []
			ToolList.where(user_id: params[:id], is_public: true, is_hidden: false).each do |list|
				if (list[:id] != params[:exclude].to_i)
					result.push({
						id: list[:id],
						name: list[:name],
					})
				end
			end

			format.json { render json: result, status: :ok}			
		end
	end

	def latest
		respond_to do |format|
			format.json { render json: ToolList.where(is_hidden: false).limit(10).reverse_order, status: :ok}			
		end
	end

	def related_by_tool
		respond_to do |format|
			result = [];
			params[:limit] ||= 10000; #need to paginate
			ToolListItem.where(tool_id: params[:id]).limit(params[:limit]).each do |item|
				tool_list = ToolList.find(item[:tool_list_id]);
				if not tool_list.is_hidden
					result.push(tool_list);
				end
			end
			format.json { render json: result, status: :ok}			
		end
	end

	def related_by_list
		# XXX need to add random parameter
		respond_to do |format|
			response = []

			@tool_list = ToolList.find(params[:id]);

			@tool_list.tool_list_items.each do |item|
				# other_lists = ToolList.joins(:tool_list_items).where.not(id: @tool_list[:id]).where('tool_list_item.id = ?', item[:id])			
				other_lists = ToolList.joins(:tool_list_items).where("`tool_lists`.`id` != ? AND `tool_list_items`.`tool_id` = ?", @tool_list[:id], item[:tool_id])
				other_lists.each do |other|
					need_add = true;

					response.each do |list|
						if other[:id] == list[:id]
							need_add = false;
							break
						end
					end

					if need_add and not other.is_hidden
						# puts "adding " + other[:id].to_s
						response.push(other)
					else
						# puts "not adding " + other[:id].to_s
					end


				end
			end

			format.json{render json: response, status: :ok}
		end
	end

	def update
		respond_to do |format|
			ToolList.transaction do
				begin
					# find out if user is 	editor or admin
					is_editor = current_user.is_admin?;
					@tool_list = ToolList.find(params[:id])
					if !is_editor			
						@tool_list.tool_list_user_roles.each do |role|
							if current_user[:id] == role.user_id
								is_editor = role.is_editor;
							end
						end
					end
					

					if is_editor
						# save intrinsic info
						@tool_list.update(safe_params)
						# delete all items						
						ToolListItem.where(tool_list_id: @tool_list.id).destroy_all;
						save_tool_items();
					end

					format.json { render json: @tool_list, status: :accepted }

					rescue ActiveRecord::RecordInvalid
						format.json { render json: @tool_list.errors, status: :unprocessable_entity }
						raise ActiveRecord::Rollback
				end
			end		
		end		
	end

	def destroy
		respond_to do |format|
			ToolList.transaction do
				begin
					@tool_list.update(is_hidden: true);
					format.json { render json: @tool_list, status: :ok }
				rescue ActiveRecord::RecordInvalid
					format.json { render json: @tool_list.errors, status: :unprocessable_entity }
					raise ActiveRecord::Rollback
				end
			end
		end
	end

	def create
		respond_to do |format|
			ToolList.transaction do
				begin
					# create tool list
					@tool_list = ToolList.create({
						user_id: current_user[:id],
						name: safe_params[:name],
						detail: safe_params[:detail],
						is_public: safe_params[:is_public],						
					})	

					# add items to tool list
					
					save_tool_items()
					# add tool list editor and follower

					@tool_list.tool_list_user_roles.create({
						user_id: current_user[:id],
						is_editor: true,
						is_follower: true
					})


					format.json { render json: @tool_list, status: :created }

				rescue ActiveRecord::RecordInvalid
					format.json { render json: @tool_list.errors, status: :unprocessable_entity }
				end
			end
		end
	end

	def featured
		featured_lists = ToolList.where(is_featured: true, is_hidden: false, is_public: true);
		respond_to do |format|
			format.json { render json: featured_lists, status: :ok}
		end
	end


	private 

		def set_tool_list
			@tool_list = ToolList.find(params[:id])
		end

		def safe_params	
			params.require(:tool_list).permit(:id, :name, :detail, :is_public, :is_hidden, :is_featured);
		end

		def save_tool_items
			if params[:tool_list_items]
				params[:tool_list_items].each_with_index do |item, index|
					@tool_list.tool_list_items.create({							
						tool_id: item[:tool][:id],
						index: index.to_i,
						notes: item[:notes]
					});
				end
			end
		end

end