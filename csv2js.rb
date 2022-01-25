require 'csv'
require 'json'

skills = Array.new
keys = nil
CSV.foreach(ARGV[0]) { |row|
  if !keys
    keys = row
  else
    skill = Hash.new
    row.each_with_index { |cell, i|
      if cell
        skill[keys[i]] = cell
      end
    }
    ( 1 .. 5 ).each { |rank|
      if max = skill["R#{rank}"]
        args = [
          skill['rarity'], 
          skill['name'], 
          skill['cond'] || "", 
          skill['cost'].to_i, 
          rank, 
          max.to_f
        ].map { |arg|
          arg.is_a?(String) ? %("#{arg}") : arg.to_s
        }        
        skills << "new Skill(#{args.join(',')})"
      end
    }
  end
}
puts("const Skills = [ #{skills.join(',')} ];")
