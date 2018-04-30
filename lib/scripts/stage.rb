#!/Users/orodrigu/.rvm/rubies/ruby-2.3.3/bin/ruby

require 'csv'
require 'date'
require_relative '../../config/environment'

class Stage

  def initialize()
    @tapor_user = User.first
    @previous_tags = {}
  end

  def clean_up_names
    Tool.all.each do |tool|
      stripped_name = tool.name.strip
      tool.save if stripped_name != tool.name      
    end
  end

  def ingest(filename)
    filepath = File.expand_path(File.dirname(__FILE__)) + "/" + filename
  
    clean_up_names

    CSV.foreach(filepath, {headers: :first_row}) do |row|
      tool_name = row[0]
      tool = Tool.where(name: tool_name).first
      dirt_entry = clean_dirt_entry row

      tool = Tool.create!(recipes: "") unless tool      

      update_tool(tool, dirt_entry)

    end
  end

  def update_value_if_needed(current_value, new_value)
    current_value == nil || current_value.to_s().strip == "" ? new_value : current_value
  end

  def update_tool_single_values(tool, dirt_entry)
    tool.user_id = update_value_if_needed(tool.user_id, @tapor_user.id)
    tool.is_approved = true
    tool.is_hidden = false;

    tool.name = update_value_if_needed(tool.name, 
      dirt_entry[:name])
    tool.detail = update_value_if_needed(tool.detail, 
      dirt_entry[:description])
    tool.url = update_value_if_needed(tool.url, 
      dirt_entry[:web_page])
    tool.creators_name = update_value_if_needed(tool.creators_name, 
      dirt_entry[:developer])
    tool.created_at = update_value_if_needed(tool.created_at, 
      dirt_entry[:update_date])
    tool.updated_at = update_value_if_needed(tool.updated_at, 
      dirt_entry[:update_date])

    # no default value for
    tool.recipes = update_value_if_needed(tool.recipes, '')
  end

  def get_tag(tag_text)
    tag = @previous_tags[tag_text]

    if tag == nil
      tag = Tag.find_or_create_by! text: tag_text
    end
    @previous_tags[tag_text] = tag
    
  end

  def update_tool_tags(tool, tags)

    tags.each do |tag|      
      tapor_tag = get_tag(tag)
      tool.tags << tapor_tag unless tool.tags.include? tapor_tag
    end
  end
  
  def update_tool_attribute_values(tool, attribute_type, values)
    values.each do |value|
      attribute = get_attribute(attribute_type, value)
      # puts attribute.inspect
      if attribute != nil
        ToolAttribute.where(
          tool_id: tool.id,
          attribute_type_id: attribute[:type].id,
          attribute_value_id: attribute[:value].id
        ).first_or_create!
      end
    end
  end

  def update_tool(tool, dirt_entry)
    # update description if it is empty, otherwise save to external program
    # add values if missing and merge otherwise

    update_tool_single_values(tool, dirt_entry)
    update_tool_tags(tool, dirt_entry[:tags])
    update_tool_attribute_values(tool, 'Web usable', [dirt_entry[:platform]])
    update_tool_attribute_values(tool, 'Warning', [dirt_entry[:status]])
    
    tool.save
  end

  def split_values(values)
    result = []
    if values
      result = values.split(',').map{|x| x.strip}
    end
    return result
  end

  def newline_to_paragraph(text)    
    result = ''
    if text 
      lines = text.split(/\n/)
      lines.each { |line| result << '<p>' << line << '</p>' }    
    end
    return result
  end

  def get_attribute(attribute_type, attribute_value)
    
    return nil if attribute_value == ""    

    attribute_type = AttributeType.find_by name: attribute_type
    
    return nil if attribute_type == nil            

    attribute_value = AttributeValue.where(
      name: attribute_value,
      attribute_type_id: attribute_type.id
    ).first_or_create!

    return {
      type: attribute_type,
      value: attribute_value
    }

  end

  def clean_dirt_entry(row)
    # 0 Title
    # 1 Description
    # 2 Web page
    # 3 TaDiRAH goals & methods
    # 4 Code license
    # 5 Developer
    # 6 Platform
    # 7 Status
    # 8 Tags
    # 9 TAPoR URL
    # 10 DiRT URL
    # 11 Updated date

    row.each do |key, value|
      row[key] = value.strip if value        
    end


    row['Status'] = ""if row['Status'] == 'Active'      

    tool_reference = {
      name: row['Title'],
      description: newline_to_paragraph(row['Description']),
      web_page: row['Web page'],
      tadirah: split_values(row['TaDiRAH goals & methods']),
      code_license: row['Code license'],
      developer: row['Developer'],
      platform: row['Platform'],
      status: row['Status'],
      tags: split_values(row['Tags']),
      tapor_url: row['TAPoR'],
      dirt_url: row['Dirt URL'],
      update_date: Date::strptime(row['Updated date'], "%m/%d/%y")
    }

  end

end


