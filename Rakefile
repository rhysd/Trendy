require 'fileutils'
include FileUtils

ROOT = __dir__.freeze
BIN = "#{ROOT}/node_modules/.bin".freeze

def cmd_exists?(cmd)
  File.exists?(cmd) && File.executable?(cmd)
end

def ensure_cmd(cmd)
  $cmd_cache ||= []
  return true if $cmd_cache.include? cmd

  paths = ENV['PATH'].split(':').uniq
  unless paths.any?{|p| cmd_exists? "#{p}/#{cmd}" }
    raise "'#{cmd}' command doesn't exist"
  else
    $cmd_cache << cmd
  end
end

file 'bower_components' do
  ensure_cmd 'bower'
  sh 'bower install'
end

file 'node_modules' do
  ensure_cmd 'npm'
  sh 'npm install'
end

file "typings" do
  ensure_cmd 'tsd'
  sh 'tsd install'
end

task :dep => %i(node_modules bower_components typings)

task :build_browser_src => %i(typings) do
  sh "#{BIN}/tsc -p #{ROOT}/browser"
end

task :build_renderer_src do
  mkdir_p 'build/renderer'

  ts_tmp_dir = "#{ROOT}/renderer-ts-compiled"
  sh "#{BIN}/tsc -p #{ROOT}/renderer"
  sh "#{BIN}/browserify -d -o #{ROOT}/build/renderer/index.js #{ts_tmp_dir}/index.js"
end

task :build => %i(dep build_browser_src build_renderer_src)

task :run do
  sh "#{ROOT}/bin/cli.js"
end

task :all => %i(build run)

task :asar do
  mkdir 'archive'
  begin
    %w(bower.json package.json index.html style build resource).each{|p| cp_r p, 'archive' }
    cd 'archive' do
      sh 'npm install --production'
      sh 'bower install --production'
    end
    sh "#{BIN}/asar pack archive app.asar"
  ensure
    rm_rf 'archive'
  end
end
