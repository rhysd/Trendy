ignore /^node_modules/, /^build/, /^typings/, /^bower_components/

guard :shell do
  watch %r[^browser/.+\.ts$] do |m|
    puts "#{Time.now}: #{m[0]}"
    system 'rake build_browser_src'
  end

  watch %r[^renderer/.+\.jsx?$] do |m|
    puts "#{Time.now}: #{m[0]}"
    system 'rake build_renderer_src'
  end
end
