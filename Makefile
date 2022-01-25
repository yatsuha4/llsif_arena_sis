RM	:= rm -rf
RUBY	:= ruby

TARGETS	:= \
	public/js/skills.js

.PHONY: all clean

all: $(TARGETS)

clean:
	$(RM) $(TARGETS)

public/js/skills.js: llsif_arena_sis.csv
	$(RUBY) csv2js.rb $< > $@
