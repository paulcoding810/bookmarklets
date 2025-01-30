base_dir="."  # Update this path

# Loop through each folder in the base directory
for folder in "$base_dir"/*; do
  if [ -d "$folder" ]; then  # Check if it's a directory
    files=("$folder"/*)  # List the files in the folder

    # Check if there is exactly one file
    if [ ${#files[@]} -eq 1 ]; then
      file="${files[0]}"
      filename=$(basename "$file")
      extension="${filename##*.}"
      folder_name=$(basename "$folder")

      # Create the new file name based on the folder's name
      new_file="$base_dir/$folder_name.$extension"

      # Rename and move the file
      mv "$file" "$new_file"
      echo "Renamed and moved $filename from $folder_name to $folder_name.$extension"
    else
      echo "Skipping $folder_name, it does not contain exactly one file."
    fi
  fi
done

find "$base_dir" -type d -empty -delete
