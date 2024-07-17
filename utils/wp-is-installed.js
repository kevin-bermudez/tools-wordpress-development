module.exports.wpIsInstalled = async (port, themeName) => {
    try {
      const response = await fetch(`http://localhost:${port}/wp-content/themes/${themeName}/test-installed.php`);
      const body = await response.text()
      return body === 'true';
    }
    catch (error) {
      return false
    }
  } 