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
      if min = skill["R#{rank}"]
        json = {
          :rarity => skill['rarity'], 
          :name => skill['name'], 
          :cond => skill['cond'], 
          :cost => skill['cost'].to_i, 
          :rank => rank, 
          :min => min.to_f
        }
        skills << "new Skill(#{JSON.dump(json)})"
      end
    }
  end
}
puts("const Skills = [ #{skills.join(',')} ];")
