# coding: utf-8
require 'csv'
require 'json'

CONDITION_POSTFIX = {
  'Muse' => '[μ’s]', 
  'Aqours' => '[Aqours]', 
  'Smile' => '[スマイル]', 
  'Pure' => '[ピュア]', 
  'Cool' => '[クール]'
}

skills = Array.new
keys = nil
CSV.foreach(ARGV[0]) { |row|
  if !keys
    keys = row
  else
    skill = Hash.new
    row.each_with_index { |cell, i|
      key = keys[i]
      if cell
        skill[key] = (value = skill[key]) ? (Array(value) + [ cell ]) : cell
      end
    }
    Array(skill['condition']).each { |condition|
      name = skill['name'] + (CONDITION_POSTFIX[condition] || '')
      ( 1 .. 5 ).each { |rank|
        if max = skill["R#{rank}"]
          min = skill["R#{rank}+"]
          args = [
            skill['rarity'], 
            name, 
            condition, 
            skill['cost'].to_i, 
            rank, 
            max.to_f, 
            min ? min.to_f : 0
          ].map { |arg|
            arg.is_a?(String) ? %("#{arg}") : arg.to_s
          }        
          skills << "new Skill(#{args.join(',')})"
        end
      }
    }
  end
}
puts(%{const Skills = [\n\t#{skills.join(",\n\t")}\n];})
