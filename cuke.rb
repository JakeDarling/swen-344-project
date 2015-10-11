# Integration test helper script
# Allows you to run cucumber tests outside of the features/ directory
# Also provides shorthand for common commands
require 'optparse'

# By default run all Use Cases
feature_tags = ['@p1']

parser = OptionParser.new do |opts|
    opts.banner = "Usage: cukes.rb [shorthand] [options]"
    opts.on('--tags t1,t2,t3', Array, 'Tags') do |tags|
        feature_tags = tags
    end

    opts.on('-h', '--help', 'Displays Help') do 
        puts opts
    end

end

parser.parse!

# Parse out the shorthand command if provided, e.g. ruby cuke.rb login
command = ARGV.pop
case command
when "login"
    feature_tags = ['@uc1', '@uc2', '@done']

when "social"
    feature_tags = ['@uc3', '@uc4']

end

# Construct the command, and only run tests that are done
# Cucumber ANDs tags when used like --tags @t1 --tag @t2
# Cucumber ORs tags when used like --tags, @t1, @t2
final_cmd = 'cucumber --tags @done --tags ' + feature_tags.join(",")

# Change current directory of this script
# Cucumber only runs when in the features directory
#Dir.chdir 'integration' do

    puts final_cmd
    system final_cmd
#end

