RUBY	:= ruby

public/js/skills.js: llsif_arena_sis.csv
	$(RUBY) csv2js.rb $< > $@
