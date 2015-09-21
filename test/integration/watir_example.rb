require 'watir-webdriver'

prefs = {
  :download => {
    :prompt_for_download => false,
    :default_directory =>  "/c/:" #/c:/Ruby200-x64/bin/"
  }
}
# Use chrome by default 
b = Watir::Browser.new :chrome, :prefs => prefs,
    :switches => %w[--ignore-certificate-errors --disable-popup-blocking --disable-translate]

b.goto("http://localhost:3000")

b.link(:text, "Rails Guides").click
