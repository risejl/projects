import re, markdown, jinja2, toml
import os, glob, pathlib, shutil, distutils.dir_util
import inflect

def load_config(config_file):
  with open(config_file, 'r') as config_file:
    config = toml.loads(config_file.read())

  ie = inflect.engine()
  for content_type in config["types"]:
    config[content_type]["plural"] = ie.plural(content_type)
  return config

def load_content_items(config, content_directory):

  def load_content_type(content_type):
    items = []
    for fn in glob.glob(f"{content_directory}/{config[content_type]['plural']}/*.md"):
      with open(fn, 'r') as file:
        frontmatter, content = re.split("^\+\+\+\+\+$",   file.read(), 1, re.MULTILINE)
      item = toml.loads(frontmatter)
      item['slug'] = os.path.splitext(os.path.basename(file.name))[0]
      if config[content_type]['dateInURL']:
        item['url'] = f"/{item['date'].year}/{item['date'].month:0>2}/{item['date'].day:0>2}/{item['slug']}/"
      else:
        item['url'] = f"/{item['slug']}/"
      item['content'] = markdown.markdown(content)
      items.append(item)
    
    items.sort(key=lambda x: x[config[content_type]['sortBy']], reverse=config[content_type]["sortReverse"])
    return items

  content_types = {}
  for content_type in config['types']:
    content_types[config[content_type]['plural']] = load_content_type(content_type)

  return content_types
    
def load_templates(template_directory):
  file_system_loader = jinja2.FileSystemLoader(template_directory)
  return jinja2.Environment(loader=file_system_loader)

def render_site(config, content, environment, output_directory):
  def render_type(content_type):
    template = environment.get_template(f"{content_type}.html")
    for item in content[config[content_type]["plural"]]:
      path = f"public/{item['url']}"
      pathlib.Path(path).mkdir(parents=True, exist_ok=True)
      with open(path+"index.html", "w") as file:
        file.write(template.render(this=item, config=config, content=content))  
    
  if os.path.exists(output_directory):
    shutil.rmtree(output_directory)
  os.mkdir(output_directory)

  for content_type in config["types"]:
    render_type(content_type)
  
  index_template = environment.get_template("index.html")
  with open("public/index.html", 'w') as file:
    file.write(index_template.render(config=config, content=content))

  distutils.dir_util.copy_tree("static", "public")

def main():
  config = load_config('./config.toml')
  content = load_content_items(config, "content")
  environment = load_templates('layout')
  render_site(config, content, environment, "public")

main()

