#### How to setup and run

1. Download and setup PostgreSQL.
2. Create an account and get an API key from SendGrid.
3. Rename `.env.example` to `.env` and update the values.
4. Install dependencies and run the dev server:

```bash
$ yarn
$ yarn dev
```

5. Visit the site, then stop the dev server and connect to your database to make sure the Employee and Visitor tables have been created.
6. Insert some data into the Employee table like so:

```sql
INSERT INTO "Employee"(name, email) values('Foo Bar', 'foo_bar@domain.com');
```

Or in the case of an office admin:

```sql
INSERT INTO "Employee"(name, email, office_admin) values('Foo Bar', 'foo_bar@domain.com', true);
```

7. Run the dev server again: `yarn dev`. All done!

App is running and available at http://localhost:3000.

#### GDPR & I18N

Please update `util/sv-us.ts` as see fit with translations. Also make _sure_ that the GDPR string complies with the necessary regulations and policies that apply to you.

## Please observe that it's against best practices to use a "noreply" email address. Read more [HERE](https://sendgrid.com/wp-content/themes/sgdotcom/pages/resource/email-deliverability/files/sendgrid-deliverability-best-practice-tips.pdf).

### License

---

MIT
