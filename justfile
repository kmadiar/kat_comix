# Strips&Meer — lokaal bekijken. Run `just` voor een overzicht.

export PATH := "/opt/homebrew/opt/ruby@3.4/bin:/opt/homebrew/lib/ruby/gems/3.4.0/bin:" + env_var("PATH")
export LANG := "en_US.UTF-8"
export LC_ALL := "en_US.UTF-8"

port := "4000"

# Toon alle commando's
default:
    @just --list

# Eenmalig: Ruby 3.4 en de gems installeren
setup:
    brew list ruby@3.4 >/dev/null 2>&1 || brew install ruby@3.4
    bundle install

# Site lokaal draaien op http://localhost:4000/kat_comix/ (herlaadt bij opslaan)
serve:
    bundle exec jekyll serve --port {{port}} --livereload

# Site lokaal draaien inclusief artikelen met een datum in de toekomst
drafts:
    bundle exec jekyll serve --port {{port}} --livereload --future

# Site bouwen naar _site/
build:
    bundle exec jekyll build

# Gebouwde bestanden en caches weggooien
clean:
    rm -rf _site .jekyll-cache .sass-cache

# Gems bijwerken naar de versie die GitHub Pages gebruikt
update:
    bundle update

# Voor het voorbeeldvenster in de Claude-app (zonder /kat_comix in de URL)
preview:
    bundle exec jekyll serve --port {{port}} --baseurl ''
