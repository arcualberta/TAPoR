#!/Users/orodrigu/.rvm/rubies/ruby-2.3.3/bin/ruby

require_relative "stage"

filename = "/dirt.csv"
ingester = Stage.new

ingester.ingest(filename)