#!/Users/orodrigu/.rvm/rubies/ruby-2.3.3/bin/ruby

require 'csv'
require 'date'
require_relative '../../config/environment'

class Stage

  def initialize()
    # All ingested data should be added by TAPoR user
    @tapor_user = User.first
    @previous_tags = {}
    @licenses = {}
    @analysis_old_to_analysis_new = {}
    @analysis_old_to_tadirah = {}
    @tadirah_to_analysis_new = {}
    @new_analysis_type_attributes = Set[]
    @tadirah_attributes = Set[]
    @analysis_old = Set[]

    initialize_licenses
    initialize_analysis_old_to_analysis_new
    initialize_analysis_old_to_tadirah
    initialize_tadirah_to_analysis_new
    initialize_new_analysis_type_attributes
    initialize_tadirah_attributes
    initialize_analysis_old

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
    add_new_multiple_attribute("Type of analysis", @new_analysis_type_attributes)
    add_new_multiple_attribute("TaDiRAH goals & methods", @tadirah_attributes)

    CSV.foreach(filepath, {headers: :first_row}) do |row|
      tool_name = row[0]
      tool = Tool.where(name: tool_name).first
      dirt_entry = clean_dirt_entry row

      tool = Tool.create!(recipes: "") unless tool      

      # This update goes through tools from the csv, you need to loop through 
      # the rest to be able to add the tadirah attributes from existing tools
      update_tool(tool, dirt_entry)
    end

    # Run through all saved tools to populate new attribute values
    add_new_analysis()
    # XXX Run this line for final test
    remove_analysis_old

  end

  def add_new_analysis
    Tool.all.each do |tool|

      # new_analysis_from_old(tool)
      # new_analysis_from_tadirah(tool)
      new_analysis_from_old_and_tadirah(tool)
      tool.save
    end
  end

  def get_tool_attributes(tool, attribute_name)
    result = Set[]
    at = AttributeType.where(name: attribute_name).first
    att_joins = tool.tool_attributes.where attribute_type_id: at.id

    att_joins.each do |att_join|      
      result << AttributeValue.find(att_join.attribute_value_id).name
    end

    return result
  end

  def new_analysis_from_old_and_tadirah(tool)
    # at = AttributeType.where(name: "Type of analysis").first
    new_attributes = Set[]
    attributes = get_tool_attributes(tool, "Type of analysis")
    attributes.each do |attribute|
      # puts "vvv"
      # puts tool.name
      # puts "---"
      # puts attribute
      # puts "---"
      # puts @analysis_old_to_analysis_new[attribute]&.inspect
      # puts "---"
      # puts @tadirah_to_analysis_new[attribute]&.inspect
      # puts "^^^"


      new_attribute = Set[]
      new_attribute.merge(@analysis_old_to_analysis_new[attribute] || [])
      # new_attribute.merge(@tadirah_to_analysis_new[attribute] || [])      
      new_attributes.merge(new_attribute)
    end


    attributes = get_tool_attributes(tool, "TaDiRAH goals & methods")

    attributes.each do |attribute|
      new_attribute = Set[]
      new_attribute.merge(@tadirah_to_analysis_new[attribute] || [])
      new_attributes.merge(new_attribute)

    end

    puts "VVV"
    puts tool.name    
    puts new_attributes.inspect
    puts "^^^"
    update_tool_attribute_values(tool, "Type of analysis", new_attributes.to_a)
  end

  def update_value_if_needed(current_value, new_value)
    current_value == nil || current_value.to_s().strip == "" ? new_value : current_value
  end

  def update_tool_single_values(tool, dirt_entry)
    tool.user_id = update_value_if_needed(tool.user_id, @tapor_user.id)
    tool.is_approved = true
    tool.is_hidden = false;

    tool.name = update_value_if_needed(tool.name, 
      dirt_entry[:name]).strip
    tool.detail = update_value_if_needed(tool.detail, 
      dirt_entry[:description])
    tool.url = update_value_if_needed(tool.url, 
      dirt_entry[:web_page])
    tool.creators_name = update_value_if_needed(tool.creators_name, 
      dirt_entry[:developer])

    today = Date.today

    tool.created_at = dirt_entry[:update_date] if tool.created_at.to_date == today 
    tool.updated_at = dirt_entry[:update_date] if tool.updated_at.to_date == today 

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

      if attribute != nil
        ToolAttribute.where(
          tool_id: tool.id,
          attribute_type_id: attribute[:type].id,
          attribute_value_id: attribute[:value].id
        ).first_or_create!
      end
    end

  end

  def remove_analysis_old
    @analysis_old.each do |analysis|
      unless @new_analysis_type_attributes.include? analysis
        get_attribute("Type of analysis", analysis)[:value].destroy
      end
    end
  end

  def add_new_multiple_attribute(attribute_name, attribute_values)
    AttributeType.where(
      name: attribute_name,
      is_multiple: true
    ).first_or_create!
    attribute_values.each { |attribute| get_attribute(attribute_name, attribute)}    
  end

  def update_tool(tool, dirt_entry)
    # update description if it is empty, otherwise save to external program
    # add values if missing and merge otherwise    

    tool_licenses = get_tool_licenses(dirt_entry[:code_license])
    update_tool_single_values(tool, dirt_entry)
    update_tool_tags(tool, dirt_entry[:tags])
    # puts tool.name + " <> " + tool_licenses.inspect
    update_tool_attribute_values(tool, 'Web usable', [dirt_entry[:platform]])
    update_tool_attribute_values(tool, 'Warning', [dirt_entry[:status]])    
    update_tool_attribute_values(tool, 'Type of license', tool_licenses)
    # feed list of captured values


    # Add tadirah types based on incoming values

    update_tool_attribute_values(tool, "TaDiRAH goals & methods", dirt_entry[:tadirah])

    # Add new analysis types
    # Esto debe de ir aparte para considerar tadirah y old atts
    # types = get_new_analysis_types(tool)
    # update_tool_attribute_values(tool, 'Type of analysis', types)

    # Add new tadirah types
    # Add new analysis types to new
  
    tool.save
  end

  def get_new_analysis_types_from_tadira(tool)
  end

  def get_new_analysis_types_from_old_atts(tool)
    result = Set[]
    attribute_type = AttributeType.where(name: "Type of analysis").first
    attributes = tool.tool_attributes.where(attribute_type_id: attribute_type.id)
    attributes.each do |att|      
      att_name = AttributeValue.find att.attribute_value_id
      name_key = @analysis_old_to_analysis_new.try(:[], att_name.name) || []
      result.merge(name_key) 
    end

    return result
  end

  def split_values(values)
    result = []
    result = values.split(',').map{|x| x.strip} if values
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
    
    # return nil if attribute_value == "" || 

    if attribute_value.strip == ""
      return nil 
    end

    attribute_type = AttributeType.find_or_create_by! name: attribute_type

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
      row[key] = value ? value.strip : ""
    end


    row['Status'] = ""if row['Status'] == 'Active'      
    
    tool_reference = {
      name: row['Title'],
      description: newline_to_paragraph(row['Description']),
      web_page: row['Web page'],
      tadirah: split_values(row['TaDiRAH goals & methods']),
      code_license: split_values(row['Code license']),
      developer: row['Developer'],
      platform: row['Platform'],
      status: row['Status'],
      tags: split_values(row['Tags']),
      tapor_url: row['TAPoR'],
      dirt_url: row['Dirt URL'],
      update_date: Date::strptime(row['Updated date'], "%m/%d/%y")
    }

  end

  def get_tool_licenses(licenses)      
    result = []
    for tapor_license, dirt_licenses in @licenses
      for license in licenses
        if dirt_licenses.include?(license)
          result.push tapor_license
          break
        end
      end
    end
    return result
  end

  def initialize_licenses
    @licenses = {
      "Open Source" => Set[
        "Open Source",
        "Apache License",
        "BSD - Open Source",
        "CDDL 1.0",
        "CPL",
        "Eclipse Public License (EPL)",
        "Educational Community License (ECM)",
        "GNU GPL",
        "GNU Affero GPL v.3",
        "GNU Affero GPL",
        "Microsoft Public License (Ms-PL)",
        "Mozilla Public License V. 1.1",
        "Mozilla Public License",
        "NCSA",
        "Open Software License (OSL)",
        "PostgreSQL License",
        "Python Software Foundation"
      ],
      "Creative Commons" => Set[
        "Creative Commons",
        "Creative Commons Attribution-Share Alike",
        "Creative Commons Attribution-Share Alike-Noncommercial",
        "Creative Commons Attribution-Share Alike-Noncommercial-ShareAlike 3.0 Unported License.",
        "Creative Commons Attribution-Share Alike-Noncommercial-No derivatives",
        "Creative Commons Attribution-Noncommerical",
        "Creative Commons-No Derivatives",
        "Creative Commons Attribution Share-Alike 3.0",
        "Creative Commons Attribution 3.0 Unported (CC BY 3.0)",
        "Creative Commons Attributions",
        "Creative Commons Attributions 3.0 Unported"
      ],
      "Free" => Set[
        "Free",
        "MIT License",
        "GPL",
        "GNU GPL v2",
        "GNU GPL v3",
        "GNU LGPL",
        "Other (GPL v3 compatible)",
        "Open Data Commons Open Database License"
      ],
      "Closed source" => Set[
        "Closed source"
      ]

    }
  end

  def initialize_analysis_old_to_analysis_new
    @analysis_old_to_analysis_new = {
      "Annotation" => Set["Enrichment", "Annotating"],
      "Bibliographic" => Set["Capture"],
      "Collaboration" => Set["Dissemination", "Collaboration"],
      "Comparison" => Set["Analysis", "Content Analysis"],
      "Concording" => Set["Analysis"],
      "Editing" => Set["Enrichment"],
      "Miscellaneous" => Set["Uncategorized"],
      "Natural Language Processing" => Set["Analysis", "Content Analysis", "Natural Language Processing"],
      "Network Analysis" => Set["Analysis"],
      "Programming Language" => Set["Programming"],
      "Publishing - Dissemination" => Set["Dissemination", "Publishing"],
      "RDF (Linked Data)" => Set["Analysis", "Visualization"],
      "Search" => Set["Discovering", "Search"],
      "Sentiment Analysis" => Set["Analysis", "Content Analysis"],
      "Sequence Analysis" => Set["Analysis"],
      "Social Media Analysis" => Set["Analysis"],
      "Statistical" => Set["Analysis"],
      "Text Cleaning" => Set["Enrichment"],
      "Text Gathering" => Set["Capture", "Gathering"],
      "Visualization" => Set["Analysis", "Visualization"]
    }
  end

  def initialize_analysis_old_to_tadirah
    @analysis_old_to_tadirah = {
      "Annotation" => Set["Enrichment", "Annotating"],
      "Bibliographic" => Set["Capture", "Recording"],
      "Collaboration" => Set["Dissemination", "Collaboration"],
      "Comparison" => Set["Analysis", "Content Analysis"],
      "Concording" => Set["Analysis", "Other (Analysis)"],
      "Editing" => Set["Enrichment", "Editing"],
      "Miscellaneous" => Set["Uncategorized"],
      "Natural Language Processing" => Set["Analysis", "Content Analysis"],
      "Network Analysis" => Set["Analysis", "Other (Analysis)"],
      "Programming Language" => Set["Creation", "Programming"],
      "Publishing - Dissemination" => Set["Dissemination", "Publishing"],
      "RDF (Linked Data)" => Set["Analysis", "Visualization"],
      "Search" => Set["Discovering"],
      "Sentiment Analysis" => Set["Analysis", "Content Analysis"],
      "Sequence Analysis" => Set["Analysis", "Relational Analysis"],
      "Social Media Analysis" => Set["Analysis", "Network Analysis"],
      "Statistical" => Set["Statistical Analysis", "Other (Analysis)"],
      "Text Cleaning" => Set["Enrichment", "Cleanup"],
      "Text Gathering" => Set["Capture", "Gathering"],
      "Visualization" => Set["Analysis", "Visualization"]
    }
  end

  def initialize_tadirah_to_analysis_new
    @tadirah_to_analysis_new = {}
    tadirah_to_analysis_old = {}
    
    @analysis_old_to_tadirah.each do |old, tadirah_list|
      tadirah_list.each do |tadirah| 
        (tadirah_to_analysis_old[tadirah] ||= Set[]) << old
      end
    end

    tadirah_to_analysis_old.each do |tadirah, analysis_old|
      analysis_old.each do |old|        
        (@tadirah_to_analysis_new[tadirah] ||= Set[]).merge(@analysis_old_to_analysis_new[old])
      end
    end    
  end

  def initialize_new_analysis_type_attributes
    @new_analysis_type_attributes = Set[
      "Analysis",
      "Annotating",
      "Capture",
      "Collaboration",
      "Content Analysis",
      "Creation",
      "Dissemination",
      "Enrichment",
      "Gathering",
      "Interpretation",
      "Modeling",
      "Natural Language Processing",
      "Organizing",
      "Publishing",
      "Search",
      "Storage",
      "Uncategorized",
      "Visualization",
      "Web development"
    ]
  end

  def initialize_tadirah_attributes
    @tadirah_attributes = Set[
      "Analysis",
      "Annotating",
      "Archiving",
      "Capture",
      "Cleanup",
      "Collaboration",
      "Commenting",
      "Communicating",
      "Content Analysis",
      "Contextualizing",
      "Conversion",
      "Creation",
      "Crowdsourcing",
      "DataRecognition",
      "Designing",
      "Discovering",
      "Dissemination",
      "Editing",
      "Enrichment",
      "Gathering",
      "Identifying",
      "Imaging",
      "Interpretation",
      "Modeling",
      "Network Analysis",
      "Organizing",
      "Other (analysis)",
      "Other (capture)",
      "Other (creation)",
      "Other (dissemination)",
      "Other (enrichment)",
      "Other (interpretation)",
      "Other (storage)",
      "Preservation",
      "Programming",
      "Publishing",
      "Recording",
      "Relational Analysis",
      "Sharing",
      "Spatial Analysis",
      "Storage",
      "Structural Analysis",
      "Stylistic Analysis",
      "Theorizing",
      "Transcription",
      "Translation",
      "Uncategorized",
      "Visualization",
      "Web development",
      "Writing",
    ]
  end

  def initialize_analysis_old
    @analysis_old = Set[
      "Annotation",
      "Bibliographic",
      "Collaboration",
      "Comparison",
      "Concording",
      "Editing",
      "Miscellaneous",
      "Natural Language Processing",
      "Network Analysis",
      "Programming Language",
      "Publishing - Dissemination",
      "RDF (Linked Data)",
      "Search",
      "Sentiment Analysis",
      "Sequence Analysis",
      "Social Media Analysis",
      "Statistical",
      "Text Cleaning",
      "Text Gathering",
      "Visualization",
    ]
  end

end


