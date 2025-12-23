Contributing to REST-iN-U
First off, thank you for considering contributing to REST-iN-U! It's people like you that make this platform better for everyone.
Table of Contents
Code of Conduct
Getting Started
Development Workflow
Pull Request Process
Style Guidelines
Reporting Bugs
Suggesting Features
Code of Conduct
This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to conduct@restinu.com.
Getting Started
Prerequisites
Node.js 20.x or later
pnpm 8.x or later
Git
A code editor (VS Code recommended)
Setting Up Your Development Environment
Fork the repository

 Click the "Fork" button in the top right corner of the repository page.


Clone your fork

 git clone https://github.com/YOUR_USERNAME/rest-in-u.git
cd rest-in-u


Add upstream remote

 git remote add upstream https://github.com/rest-in-u/platform.git


Install dependencies

 cd frontend
pnpm install


Set up environment variables

 cp .env.example .env.local


Start the development server

 pnpm dev


Recommended VS Code Extensions
ESLint
Prettier
Tailwind CSS IntelliSense
TypeScript Vue Plugin (Volar)
GitLens
Development Workflow
Branch Naming Convention
feature/ - New features (e.g., feature/vastu-calculator)
fix/ - Bug fixes (e.g., fix/login-redirect)
docs/ - Documentation changes (e.g., docs/api-readme)
refactor/ - Code refactoring (e.g., refactor/property-service)
test/ - Test additions/fixes (e.g., test/auth-flow)
Creating a New Branch
## Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

## Create a new branch
git checkout -b feature/your-feature-name

Making Changes
Write your code following our Style Guidelines
Write/update tests as needed
Ensure all tests pass: pnpm test
Run linting: pnpm lint
Run type checking: pnpm type-check
Committing Changes
We use Conventional Commits:
## Format
<type>(<scope>): <description>

## Examples
feat(auth): add social login with Google
fix(search): correct filter reset behavior
docs(readme): update installation instructions
style(ui): improve button hover states
refactor(api): simplify property service
test(e2e): add search flow tests
chore(deps): update dependencies

Types:
feat - A new feature
fix - A bug fix
docs - Documentation only changes
style - Changes that don't affect code meaning
refactor - Code change that neither fixes a bug nor adds a feature
perf - Performance improvement
test - Adding or correcting tests
chore - Changes to the build process or auxiliary tools
Pull Request Process
Update your branch

 git fetch upstream
git rebase upstream/main


Push your changes

 git push origin feature/your-feature-name


Create a Pull Request


Go to your fork on GitHub
Click "New Pull Request"
Select your branch
Fill out the PR template
PR Requirements


Clear description of changes
Linked issues (if applicable)
All tests passing
No lint errors
TypeScript types correct
Documentation updated (if needed)
Code Review


At least one approval required
Address all feedback
Keep commits clean (squash if needed)
Merge


Maintainers will merge once approved
We use "Squash and merge" strategy
Style Guidelines
TypeScript
// Use explicit types
function calculateVastuScore(property: Property): number {
  // ...
}

// Use interfaces for objects
interface PropertyFilters {
  type?: string[];
  priceMin?: number;
  priceMax?: number;
}

// Use enums for fixed values
enum PropertyStatus {
  Available = 'available',
  Pending = 'pending',
  Sold = 'sold',
}

React Components
// Use functional components
export function PropertyCard({ property, onFavorite }: PropertyCardProps) {
  // Use hooks at the top
  const [isHovered, setIsHovered] = useState(false);
  
  // Event handlers
  const handleClick = useCallback(() => {
    // ...
  }, []);
  
  // Render
  return (
    <div className="property-card">
      {/* ... */}
    </div>
  );
}

// Export types separately
export interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
}

Tailwind CSS
// Use Tailwind utility classes
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
  
// Group related classes
<button className={cn(
  // Layout
  "flex items-center justify-center",
  // Sizing
  "px-4 py-2",
  // Colors
  "bg-primary-600 text-white",
  // States
  "hover:bg-primary-700 focus:ring-2",
  // Conditional
  isDisabled && "opacity-50 cursor-not-allowed"
)}>

File Organization
component/
â”œâ”€â”€ index.ts           # Exports
â”œâ”€â”€ Component.tsx      # Main component
â”œâ”€â”€ Component.test.tsx # Tests
â”œâ”€â”€ types.ts           # Types (if complex)
â””â”€â”€ utils.ts           # Utilities (if needed)

Testing
// Unit tests with Jest
describe('PropertyCard', () => {
  it('renders property information', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
  });

  it('calls onFavorite when heart is clicked', () => {
    const onFavorite = jest.fn();
    render(<PropertyCard property={mockProperty} onFavorite={onFavorite} />);
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
    expect(onFavorite).toHaveBeenCalledWith(mockProperty.id);
  });
});

Reporting Bugs
Before Submitting
Check existing issues for duplicates
Ensure you can reproduce the bug
Collect relevant information
Bug Report Template
**Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14.2]
- Screen size: [e.g., 1920x1080]

**Additional Context**
Any other relevant information.

Suggesting Features
Feature Request Template
**Problem**
Describe the problem this feature would solve.

**Proposed Solution**
Your suggested solution.

**Alternatives Considered**
Other approaches you've thought about.

**Additional Context**
Mockups, examples, or references.


Questions?
Join our Discord
Email us at dev@restinu.com
Open a Discussion
Thank you for contributing! ðŸ™

