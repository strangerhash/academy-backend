class EmailConfig {
  public port: string;
  public host: string;
  public password: string;
  public username: string;


  constructor(port: string, host: string, username: string, password: string) {

    this.host = "smtp.office365.com";
    this.port = "587";
    this.username = "test";
    this.password = "Setup@123";

  }
}

export default EmailConfig;
