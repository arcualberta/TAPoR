#!/Users/orodrigu/.rvm/rubies/ruby-2.3.3/bin/ruby

require_relative '../../config/environment'

Tool.all.each do |tool|
  stripped_name = tool.name.strip
  if stripped_name != tool.name
  	tool.save
  end
end