// client/src/pages/AboutPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

function AboutPage() {
    return (
        <Layout>
            <div>
                <h1>About Pool Party</h1>

                <section className="about-content">
                    <h2>What is Pool Party?</h2>
                    <p>
                        Pool Party is a tool for card game enthusiasts to manage, build, and share
                        their card pools. Whether you're drafting a new set or organizing your
                        sealed pool, Pool Party helps you efficiently organize your cards into
                        mainboard and sideboard.
                    </p>

                    <h2>Features</h2>
                    <ul>
                        <li>
                            Easy drag-and-drop interface for moving cards between mainboard and
                            sideboard
                        </li>
                        <li>Save your pools to access them later</li>
                        <li>Upload card lists to quickly create pools</li>
                        <li>Check out the Pool of the Day for inspiration</li>
                    </ul>

                    <h2>How to Use</h2>
                    <ol>
                        <li>
                            <strong>Upload Pool:</strong> Paste your card list in the Upload page to
                            create a new pool.
                        </li>
                        <li>
                            <strong>Build Pool:</strong> Use the intuitive drag-and-drop interface
                            to arrange your cards.
                        </li>
                        <li>
                            <strong>Save Pool:</strong> Click Save to store your pool for future
                            reference.
                        </li>
                        <li>
                            <strong>Share Pool:</strong> Copy the URL to share your pool with
                            friends.
                        </li>
                    </ol>

                    <h2>Contact</h2>
                    <p>
                        Have suggestions or found a bug? Please reach out to us at
                        <a href="mailto:contact@poolparty.example.com">
                            contact@poolparty.example.com
                        </a>
                        .
                    </p>
                </section>

                <div className="navigation">
                    <Link to="/">Return to Home</Link>
                </div>
            </div>
        </Layout>
    );
}

export default AboutPage;
