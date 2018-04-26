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
      if stripped_name != tool.name
       tool.save
      end
    end
  end

  def ingest(filename)
    filepath = File.expand_path(File.dirname(__FILE__)) + "/" + filename
  
    clean_up_names

    CSV.foreach(filepath, {headers: :first_row}) do |row|
      tool_name = row[0]
      tool = Tool.where(name: tool_name).first()
      dirt_entry = clean_dirt_entry row

      if ! tool
        tool = Tool.new
      end

      update_tool(tool, dirt_entry)

    end
  end

  # def can_update_value(value)
  #   value == nil || value.strip == ""
  # end

  def update_value_if_needed(current_value, new_value)
    current_value == nil || current_value.to_s().strip == "" ? new_value : current_value
  end

  # <Tool id: nil
  # user_id: 1
  # name: nil
  # detail: "Frogr is a small application for the GNOME desktop..."
  # url: "http://wiki.gnome.org/Frogr"
  # is_approved: true
  # creators_name: "Mario Sanchez"
  # creators_email: nil
  # creators_url: nil
  # image_url: nil
  # star_average: 0.0
  # is_hidden: false
  # last_updated: nil
  # documentation_url: nil
  # code: nil
  # repository: nil
  # language: nil
  # nature: 0
  # created_at: "2014-12-29 00:00:00"
  # updated_at: "2014-12-29 00:00:00"
  # recipes: nil>

  def update_tool_single_values(tool, dirt_entry)
    tool.user_id = update_value_if_needed(tool.user_id, @tapor_user.id)
    tool.is_approved = true
    tool.is_hidden = false;

    tool.name = update_value_if_needed(tool.name, dirt_entry[:name])
    tool.detail = update_value_if_needed(tool.detail, dirt_entry[:description])
    tool.url = update_value_if_needed(tool.url, dirt_entry[:web_page])

    update_value_if_needed(tool.creators_name, dirt_entry[:developer])
    tool.creators_name = update_value_if_needed(tool.creators_name, dirt_entry[:developer])
    
    tool.created_at = update_value_if_needed(tool.created_at, dirt_entry[:update_date])
    tool.updated_at = update_value_if_needed(tool.updated_at, dirt_entry[:update_date])

    # no default value for
    tool.recipes = update_value_if_needed(tool.recipes, '')
  end

  def get_tag(tag_text)
    tag = @previous_tags[tag_text]

    if tag == nil
      tag = Tag.where(text: tag_text).first
      if tag == nil
        tag = Tag.create({text: tag_text})
      end
    end
    # puts tag.text
    @previous_tags[tag_text] = tag
    
  end

  def update_tool_tags(tool, tags)

    tags.each do |tag|      
      tapor_tag = get_tag(tag)

      unless tool.tags.include? tapor_tag
        tool.tags << tapor_tag
      end

    end
  end
  
  def update_tool(tool, dirt_entry)
    # update description if it is empty, otherwise save to external program
    # add values if missing and merge otherwise

    update_tool_single_values(tool, dirt_entry)
    update_tool_tags(tool, dirt_entry[:tags])

    tool.save
    # puts tool.inspect

  end

  def split_values(values)
    result = []
    if values
      result = values.split(',').map{|x| x.strip}
    end
    return result
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
      if value
        row[key] = value.strip
      end
    end

    tool_reference = {
      name: row['Title'],
      description: row['Description'],
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

  # def initialize()
  # 	@tapor_tool_count = 0
  #   @dirt_tool_count = 0
  # end

  # def ingest(filename)
  #   CSV.foreach(File.expand_path(File.dirname(__FILE__)) + "/dirt.csv") do |row|
  #   tool_name = row[0]
  #   # print tool_name + "\n"
  #   tool = Tool.where(name: tool_name).first()
  #   if tool
  #     # print "TAPoR: " + tool.name + "\n"

  #     print "VVV\n"
  #     print tool.detail
  #     print "\n===\n"
  #     print row[1]
  #     print "\n^^^\n"

  #     @tapor_tool_count += 1
  #   end
  #   # print "Dirt: " + tool_name + "\n"
  #   @dirt_tool_count += 1

  # end

  # print "TAPoR tools: " + @tapor_tool_count.to_s + "\n"
  # print "Dirt tools: " + @dirt_tool_count.to_s + "\n"
  # end

end


