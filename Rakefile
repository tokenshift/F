require 'uglifier'

JS_DIR = "js"
BUILD_DIR = "build"
DOCS_DIR = "docs"

task :clean do
  puts "Deleting #{BUILD_DIR}"
  FileUtils.rm_rf BUILD_DIR

  puts "Deleting #{DOCS_DIR}"
  FileUtils.rm_rf DOCS_DIR
end


# 'Illiterates' literate code, separating markdown from code.
def illiterate(input, output, mode = :code)
  if input.is_a? String
    input = File.open(input)
  end

  input.each_line do |line|
    case mode
    when :code
      output.write(line[1..-1]) if line.start_with? "\t"
    when :text
      output.write(line) unless line.start_with? "\t"
    when :both
      output.write(line)
    else
      throw "Mode must be :code, :text, or :both."
    end
  end
end

rule ".js" => ->(f) {
  File.join(JS_DIR, File.basename(f) + ".md")
} do |file|
  puts "#{file.source} => #{file.name}"
  File.open(file.name, "w") do |out|
    illiterate(file.source, out, :code)
  end
end

rule ".min.js" => ->(f) {
  File.join(BUILD_DIR, File.basename(f, ".min.js") + ".js")
} do |file|
  puts "#{file.source} => #{file.name}"
  File.open(file.name, "w") do |out|
    out.write(Uglifier.compile(File.read(file.source)))
  end
end

directory BUILD_DIR
build_js = FileList["#{JS_DIR}/*.js.md"]
           .pathmap("%{#{JS_DIR}/,#{BUILD_DIR}/}X")
build_min_js = build_js.pathmap("%X.min.js")

task :js => [BUILD_DIR, build_js, build_min_js]


rule ".js.html" => ->(f) {
  File.join(JS_DIR, File.basename(f, ".js.html") + ".js.md")
} do |file|
  puts "#{file.source} => #{file.name}"
  system("docco #{file.source} -o #{DOCS_DIR}")
end

js_docs = FileList["#{JS_DIR}/*.js.md"]
          .pathmap("%{#{JS_DIR}/,#{DOCS_DIR}/}X.html")
directory DOCS_DIR
task :js_docs => [DOCS_DIR, js_docs]


task :default => [:js, :js_docs]
